const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    
    const email = 'admin@mtcaramelhelps.com'; // Using a proper email format
    const password = 'admin123';
    const username = 'admin';
    
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Created Firebase Auth user with UID: ${user.uid}`);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      role: 'admin',
      createdAt: new Date(),
    });
    
    console.log('✅ Created user document in Firestore');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👑 Role: admin`);
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('email-already-in-use')) {
      console.log('⚠️  Admin user already exists with this email address');
    } else {
      console.error('❌ Error creating admin user:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting admin user creation for Mt. Caramel H.E.L.P.S...');
    console.log(`📍 Project ID: ${firebaseConfig.projectId}`);
    
    await createAdminUser();
    
    console.log('✅ Admin user creation completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Email: admin@mtcaramelhelps.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Remember to change the password after first login!');
    
  } catch (error) {
    console.error('❌ Admin user creation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
