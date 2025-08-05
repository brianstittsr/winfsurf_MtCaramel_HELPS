// This script generates the admin user data that can be manually added to Firebase
// Use this if you don't have Firebase SDK properly configured yet

console.log('🔐 Admin User Data for Mt. Caramel H.E.L.P.S.');
console.log('='.repeat(50));

const adminUserData = {
  email: 'admin@mtcaramelhelps.com',
  username: 'admin',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

console.log('\n📋 User Authentication (Firebase Console):');
console.log('1. Go to Firebase Console > Authentication > Users');
console.log('2. Click "Add user"');
console.log(`3. Email: ${adminUserData.email}`);
console.log('4. Password: admin123');
console.log('5. Click "Add user"');

console.log('\n📄 User Document (Firestore):');
console.log('1. Go to Firebase Console > Firestore Database');
console.log('2. Navigate to "users" collection');
console.log('3. Add a new document with the user\'s UID as the document ID');
console.log('4. Add the following fields:');
console.log('');
console.log('Document Data:');
console.log(JSON.stringify(adminUserData, null, 2));

console.log('\n🔧 Alternative: Use Firebase CLI');
console.log('If you have Firebase CLI set up:');
console.log('1. Run: firebase auth:import users.json');
console.log('2. Where users.json contains the user data');

console.log('\n⚠️  Security Note:');
console.log('Remember to change the password after first login!');

// Also write to a JSON file for easy import
const fs = require('fs');
const userImportData = {
  users: [
    {
      localId: 'admin-user-' + Date.now(),
      email: adminUserData.email,
      emailVerified: true,
      passwordHash: 'admin123', // This will need to be properly hashed
      displayName: adminUserData.username,
      createdAt: adminUserData.createdAt,
      lastLoginAt: adminUserData.createdAt,
      customAttributes: JSON.stringify({ role: 'admin' })
    }
  ]
};

try {
  fs.writeFileSync('admin-user-import.json', JSON.stringify(userImportData, null, 2));
  console.log('\n📁 Created admin-user-import.json for Firebase CLI import');
} catch (error) {
  console.log('\n❌ Could not create import file:', error instanceof Error ? error.message : String(error));
}
