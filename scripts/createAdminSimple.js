// Simple admin user creation using Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize Firebase Admin with default credentials
// This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
// or the default service account if running on Google Cloud
try {
  admin.initializeApp({
    projectId: 'mtcaramelhelps',
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.log('⚠️  Firebase Admin already initialized or error:', error.message);
}

const auth = admin.auth();
const db = admin.firestore();

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    
    const email = 'admin@mtcaramelhelps.com';
    const password = 'admin123';
    const username = 'admin';
    
    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: username,
      emailVerified: true,
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
    console.log('\n📋 Login credentials:');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👑 Role: admin`);
    console.log(`🆔 UID: ${userRecord.uid}`);
    
    return userRecord;
    
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  Admin user already exists with this email address');
      // Get the existing user
      const userRecord = await auth.getUserByEmail('admin@mtcaramelhelps.com');
      console.log(`🆔 Existing user UID: ${userRecord.uid}`);
      return userRecord;
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
    
    const userRecord = await createAdminUser();
    
    console.log('\n✅ Admin user setup completed successfully!');
    console.log('\n⚠️  Remember to change the password after first login!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Admin user creation failed:', error);
    console.log('\n🔧 Setup required:');
    console.log('1. Install Firebase Admin SDK: npm install firebase-admin');
    console.log('2. Set up service account authentication');
    console.log('3. Or use Firebase Console manually');
    process.exit(1);
  }
}

// Run the script
main();
