import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(repoRoot, 'apps', 'frontend', 'firebase-applet-config.json');
const backupRoot = path.join(repoRoot, 'backups', 'firebase');
const args = new Set(process.argv.slice(2));
const writesPaused = args.has('--writes-paused');
const dryRun = args.has('--dry-run');

if (args.has('--help')) {
  console.log('Usage: node scripts/backup-firebase.mjs [--dry-run | --writes-paused]');
  process.exit(0);
}

if (dryRun && writesPaused) {
  throw new Error('Choose either --dry-run or --writes-paused.');
}

if (!dryRun && !writesPaused) {
  throw new Error('Pause writes and run with --writes-paused before exporting production data. Use --dry-run to inspect the target.');
}

const config = JSON.parse(await readFile(configPath, 'utf8'));
const projectId = config.projectId;
const databaseId = config.firestoreDatabaseId || '(default)';
const bucket = config.storageBucket;

if (!projectId || !bucket) {
  throw new Error('Firebase projectId and storageBucket must be set in the frontend Firebase config.');
}

if (dryRun) {
  console.log(JSON.stringify({
    projectId,
    firestoreDatabaseId: databaseId,
    storageBucket: bucket,
    outputDirectory: path.relative(repoRoot, backupRoot),
    dataIncluded: ['Firestore documents and nested subcollections', 'Cloud Storage object bytes and metadata'],
    dataNotIncluded: ['Firebase Authentication accounts', 'Firebase Realtime Database', 'Firebase rules and indexes'],
    credentials: 'Google Application Default Credentials; no key file is read or copied.',
  }, null, 2));
  process.exit(0);
}

let cachedToken;
let tokenExpiresAt = 0;

function getAccessToken(forceRefresh = false) {
  if (!forceRefresh && cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const command = process.platform === 'win32' ? 'gcloud.cmd' : 'gcloud';
    cachedToken = execFileSync(command, ['auth', 'application-default', 'print-access-token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true,
      shell: process.platform === 'win32',
    }).trim();
  } catch {
    throw new Error('Google Cloud credentials are unavailable. Install Google Cloud CLI and run: gcloud auth application-default login');
  }

  if (!cachedToken) {
    throw new Error('Google Cloud CLI returned an empty access token.');
  }

  tokenExpiresAt = Date.now() + 40 * 60 * 1000;
  return cachedToken;
}

async function googleFetch(url, options = {}, retryAuth = true) {
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${getAccessToken()}`);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers, signal: AbortSignal.timeout(120_000) });
  if (response.status === 401 && retryAuth) {
    cachedToken = undefined;
    tokenExpiresAt = 0;
    return googleFetch(url, options, false);
  }
  if (!response.ok) {
    throw new Error(`Google API request failed with HTTP ${response.status}. Verify the signed-in account has read access to this Firebase project.`);
  }
  return response;
}

async function googleJson(url, options) {
  const response = await googleFetch(url, options);
  return response.json();
}

const firestoreRoot = `projects/${encodeURIComponent(projectId)}/databases/${encodeURIComponent(databaseId)}/documents`;
const encodeResourcePath = (resource) => resource.split('/').map(encodeURIComponent).join('/');

async function listCollectionIds(parentResource) {
  const collectionIds = [];
  let pageToken;

  do {
    const url = new URL(`https://firestore.googleapis.com/v1/${encodeResourcePath(parentResource)}:listCollectionIds`);
    url.searchParams.set('pageSize', '1000');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const result = await googleJson(url, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    collectionIds.push(...(result.collectionIds || []));
    pageToken = result.nextPageToken;
  } while (pageToken);

  return collectionIds;
}

async function listDocuments(parentResource, collectionId) {
  const documents = [];
  let pageToken;

  do {
    const url = new URL(`https://firestore.googleapis.com/v1/${encodeResourcePath(parentResource)}/${encodeURIComponent(collectionId)}`);
    url.searchParams.set('pageSize', '1000');
    url.searchParams.set('showMissing', 'true');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const result = await googleJson(url);
    documents.push(...(result.documents || []));
    pageToken = result.nextPageToken;
  } while (pageToken);

  return documents;
}

function writeLine(stream, value) {
  if (stream.write(`${JSON.stringify(value)}\n`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    stream.once('drain', resolve);
    stream.once('error', reject);
  });
}

async function finishStream(stream) {
  await new Promise((resolve, reject) => {
    stream.once('error', reject);
    stream.end(resolve);
  });
}

async function exportFirestore(outputPath) {
  const filePath = path.join(outputPath, 'firestore-documents.jsonl');
  const stream = createWriteStream(filePath, { flags: 'wx' });
  let documentCount = 0;
  let collectionCount = 0;

  async function visitCollection(parentResource, collectionId) {
    collectionCount += 1;
    const documents = await listDocuments(parentResource, collectionId);

    for (const document of documents) {
      await writeLine(stream, {
        name: document.name,
        fields: document.fields || {},
        createTime: document.createTime || null,
        updateTime: document.updateTime || null,
        missing: !document.fields,
      });
      documentCount += 1;

      for (const childCollection of await listCollectionIds(document.name)) {
        await visitCollection(document.name, childCollection);
      }
    }
  }

  try {
    for (const collectionId of await listCollectionIds(firestoreRoot)) {
      await visitCollection(firestoreRoot, collectionId);
    }
    await finishStream(stream);
  } catch (error) {
    stream.destroy();
    throw error;
  }

  return {
    documentCount,
    collectionCount,
    file: 'firestore-documents.jsonl',
    sha256: await hashFile(filePath),
  };
}

async function hashFile(filePath) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk);
  }
  return hash.digest('hex');
}

async function exportStorage(outputPath) {
  const blobDirectory = path.join(outputPath, 'storage-objects');
  await mkdir(blobDirectory);
  const index = [];
  let pageToken;

  do {
    const url = new URL(`https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o`);
    url.searchParams.set('maxResults', '1000');
    url.searchParams.set('fields', 'items(name,generation,size,md5Hash,crc32c,contentType,updated,timeCreated,metadata),nextPageToken');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const result = await googleJson(url);

    for (const object of result.items || []) {
      const blobName = `${String(index.length + 1).padStart(8, '0')}.blob`;
      const blobPath = path.join(blobDirectory, blobName);
      const mediaUrl = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(object.name)}?alt=media`;
      const response = await googleFetch(mediaUrl);
      if (!response.body) {
        throw new Error('Storage API returned an empty object body.');
      }

      await pipeline(
        Readable.fromWeb(response.body),
        createWriteStream(blobPath, { flags: 'wx' }),
      );

      index.push({
        file: `storage-objects/${blobName}`,
        name: object.name,
        generation: object.generation,
        size: object.size,
        md5Hash: object.md5Hash || null,
        crc32c: object.crc32c || null,
        contentType: object.contentType || null,
        timeCreated: object.timeCreated || null,
        updated: object.updated || null,
        metadata: object.metadata || {},
        sha256: await hashFile(blobPath),
      });
      console.log(`Downloaded Storage object ${index.length}.`);
    }

    pageToken = result.nextPageToken;
  } while (pageToken);

  await writeFile(path.join(outputPath, 'storage-index.json'), `${JSON.stringify(index, null, 2)}\n`, { flag: 'wx' });
  return { objectCount: index.length, indexFile: 'storage-index.json' };
}

const timestamp = new Date().toISOString().replaceAll(':', '-');
const partialPath = path.join(backupRoot, `${timestamp}.partial`);
const completePath = path.join(backupRoot, timestamp);

getAccessToken();
await mkdir(backupRoot, { recursive: true });
await mkdir(partialPath);
console.log(`Starting local backup for Firebase project ${projectId}.`);

try {
  const firestore = await exportFirestore(partialPath);
  console.log(`Firestore export complete: ${firestore.documentCount} documents across ${firestore.collectionCount} collections.`);
  const storage = await exportStorage(partialPath);

  const manifest = {
    status: 'complete',
    completedAt: new Date().toISOString(),
    projectId,
    firestoreDatabaseId: databaseId,
    storageBucket: bucket,
    firestore,
    storage,
    notes: [
      'Firestore REST values preserve their typed JSON representation.',
      'Storage object metadata and bytes are included.',
      'Firebase Authentication accounts, Realtime Database, rules, and indexes are not included.',
      'Keep this backup local; it may contain personal and customer data.',
    ],
  };
  await writeFile(path.join(partialPath, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
  await rename(partialPath, completePath);
  await writeFile(path.join(backupRoot, 'BACKUP_STATUS.txt'), [
    'Firebase data backup status',
    '',
    `Latest completed backup: ${timestamp}`,
    `Firestore documents: ${firestore.documentCount}`,
    `Firestore collections: ${firestore.collectionCount}`,
    `Storage objects: ${storage.objectCount}`,
    `Backup directory: ${path.relative(repoRoot, completePath)}`,
    '',
    'This backup is local-only and Git-ignored. Keep it secure and do not upload it.',
    'Firebase Authentication accounts, Realtime Database, rules, and indexes are not included.',
    '',
  ].join('\n'));

  console.log(`Backup completed locally: ${path.relative(repoRoot, completePath)}`);
} catch (error) {
  console.error(`Backup did not complete. Any partial local files remain in ${path.relative(repoRoot, partialPath)}.`);
  throw error;
}
