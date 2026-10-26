# Firebase local backup

The backup script writes Firestore documents and Firebase Storage objects to
`backups/firebase/`. That directory is Git-ignored because exports contain
personal and customer data. The script does not change or delete anything in
Firebase.

## One-time local setup

1. Install Google Cloud CLI from
   <https://cloud.google.com/sdk/docs/install>, then open a new PowerShell
   window.
2. Sign in using your own Google account:
   ```powershell
   gcloud auth application-default login
   ```
   This uses browser sign-in and stores local credentials outside this
   repository. Do not create, paste, or commit a service-account key.
3. Preview the configured project and destination:
   ```powershell
   node scripts/backup-firebase.mjs --dry-run
   ```
   Project, named Firestore database, and bucket are read from
   `apps/frontend/firebase-applet-config.json`. Do not edit that file with
   passwords or private keys.
4. During the approved maintenance window, stop application writes to
   Firestore and Storage. Then run:
   ```powershell
   node scripts/backup-firebase.mjs --writes-paused
   ```

The signed-in Google account needs Firestore document/list access (typically
`roles/datastore.viewer`) and Storage object list/read access (typically
`roles/storage.objectViewer`) for this project. The project owner can grant
these roles in Google Cloud IAM if needed.

The completed backup contains `firestore-documents.jsonl` (including nested
subcollections and typed Firestore values), `storage-objects/` (object bytes),
`storage-index.json` (object names and metadata), and `manifest.json` with
counts and checksums. Failed runs remain in a `.partial` directory and are
not reported as complete. The latest status is recorded in the ignored
`backups/firebase/BACKUP_STATUS.txt`.

This export does not include Firebase Authentication accounts, Realtime
Database, security rules, or indexes. It is a read/export operation, but
Google Cloud API requests, Storage operations, and downloading stored bytes
may be billable under the project's current plan. Check expected storage size
and billing before running a large export. Keep the generated files on a
trusted, encrypted local disk; never upload them to GitHub or send them in
chat.
