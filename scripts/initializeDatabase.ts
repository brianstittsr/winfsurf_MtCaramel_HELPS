import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Firebase configuration for mtcaramelhelps project
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "mtcaramelhelps.firebaseapp.com",
  projectId: "mtcaramelhelps",
  storageBucket: "mtcaramelhelps.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Default supply items to initialize
const defaultSupplyItems = [
  { name: 'Notebooks', unit: 'individual', available_quantity: 100 },
  { name: 'Pencils', unit: 'box', available_quantity: 50 },
  { name: 'Pens', unit: 'box', available_quantity: 30 },
  { name: 'Erasers', unit: 'individual', available_quantity: 75 },
  { name: 'Rulers', unit: 'individual', available_quantity: 40 },
  { name: 'Glue Sticks', unit: 'individual', available_quantity: 60 },
  { name: 'Colored Pencils', unit: 'box', available_quantity: 25 },
  { name: 'Markers', unit: 'box', available_quantity: 20 },
  { name: 'Paper', unit: 'ream', available_quantity: 15 },
  { name: 'Folders', unit: 'individual', available_quantity: 80 },
  { name: 'Binders', unit: 'individual', available_quantity: 35 },
  { name: 'Index Cards', unit: 'pack', available_quantity: 45 },
  { name: 'Highlighters', unit: 'pack', available_quantity: 30 },
  { name: 'Scissors', unit: 'individual', available_quantity: 25 },
  { name: 'Staplers', unit: 'individual', available_quantity: 15 },
  { name: 'Staples', unit: 'box', available_quantity: 40 },
  { name: 'Paper Clips', unit: 'box', available_quantity: 35 },
  { name: 'Rubber Bands', unit: 'pack', available_quantity: 20 },
  { name: 'Calculators', unit: 'individual', available_quantity: 12 },
  { name: 'Backpacks', unit: 'individual', available_quantity: 25 }
];

async function initializeSupplyItems() {
  try {
    console.log('🔍 Checking existing supply items...');
    
    // Check if supply items already exist
    const existingItems = await getDocs(collection(db, 'supply_items'));
    
    if (existingItems.size > 0) {
      console.log(`✅ Found ${existingItems.size} existing supply items. Skipping initialization.`);
      return;
    }

    console.log('📦 Initializing default supply items...');
    
    // Add default supply items
    for (const item of defaultSupplyItems) {
      await addDoc(collection(db, 'supply_items'), item);
      console.log(`✅ Added: ${item.name} (${item.available_quantity} ${item.unit})`);
    }
    
    console.log(`🎉 Successfully initialized ${defaultSupplyItems.length} supply items!`);
    
  } catch (error) {
    console.error('❌ Error initializing supply items:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting database initialization for Mt. Caramel H.E.L.P.S...');
    console.log(`📍 Project ID: ${firebaseConfig.projectId}`);
    
    await initializeSupplyItems();
    
    console.log('✅ Database initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Deploy Firestore security rules: firebase deploy --only firestore:rules');
    console.log('2. Deploy Storage security rules: firebase deploy --only storage');
    console.log('3. Set up Authentication in Firebase Console');
    console.log('4. Configure your .env.local file with Firebase credentials');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
main();
