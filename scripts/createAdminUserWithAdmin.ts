// This script uses Firebase Admin SDK to create an admin user
// You'll need to set up a service account key for this to work
// Instructions: https://firebase.google.com/docs/admin/setup#initialize-sdk

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to download the service account key from Firebase Console
// and either set GOOGLE_APPLICATION_CREDENTIALS environment variable
// or provide the path to the service account key file

try {
  admin.initializeApp({
    projectId: 'mtcaramelhelps',
  });
} catch (error) {
  console.log('Firebase Admin already initialized or error:', error.message);
}

const auth = admin.auth();
const db = admin.firestore();

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user with Firebase Admin SDK...');
    
    const email = 'admin@mtcaramelhelps.com';
    const password = 'admin123';
    const username = 'admin';
    
    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: username,
    });
    
    console.log(`✅ Created Firebase Auth user with UID: ${userRecord.uid}`);
    
    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      username: username,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Created user document in Firestore');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👑 Role: admin`);
    
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
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
    console.log('📍 Project ID: mtcaramelhelps');
    
    await createAdminUser();
    
    console.log('✅ Admin user creation completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Email: admin@mtcaramelhelps.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Remember to change the password after first login!');
    
  } catch (error) {
    console.error('❌ Admin user creation failed:', error);
    console.log('\n🔧 Setup required:');
    console.log('1. Install Firebase Admin SDK: npm install firebase-admin');
    console.log('2. Set up service account authentication');
    console.log('3. See FIREBASE_SETUP.md for detailed instructions');
    process.exit(1);
  }
}

// Run the script
main();
