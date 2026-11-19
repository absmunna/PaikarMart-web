import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Note: Ensure FIREBASE_SERVICE_ACCOUNT_JSON env var is set
initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

async function extractProducts() {
  console.log('Starting extraction...');
  const snapshot = await db.collection('products').get();
  const products: any[] = [];
  
  snapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });

  const outputPath = path.join(process.cwd(), 'products_export.json');
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
  console.log(`Extracted ${products.length} products to ${outputPath}`);
}

extractProducts().catch(console.error);
