# 🚨 URGENT: Create Admin User Manually

You're getting "invalid-login-credentials" because the admin user doesn't exist yet. Here's how to create it:

## 🔥 Quick Fix - Firebase Console Method

### Step 1: Create Authentication User
1. **Open Firebase Console**: https://console.firebase.google.com/u/0/project/mtcaramelhelps/authentication/users
2. **Click "Add user"**
3. **Enter details**:
   - Email: `admin@mtcaramelhelps.com`
   - Password: `admin123`
4. **Click "Add user"**
5. **COPY THE UID** that gets generated (you'll need it for Step 2)

### Step 2: Create Firestore User Document
1. **Open Firestore**: https://console.firebase.google.com/u/0/project/mtcaramelhelps/firestore/data
2. **Navigate to "users" collection** (create it if it doesn't exist)
3. **Click "Add document"**
4. **Document ID**: Use the UID from Step 1
5. **Add these fields**:
   ```
   uid: [string] → The UID from Step 1
   email: [string] → admin@mtcaramelhelps.com
   username: [string] → admin
   role: [string] → admin
   createdAt: [timestamp] → Click "Current timestamp"
   ```
6. **Click "Save"**

## ✅ Test Login
After completing both steps, try logging in with:
- **Email**: admin@mtcaramelhelps.com
- **Password**: admin123

## 🔧 Alternative: Firebase CLI (if you have service account)

If you have Firebase service account credentials:

1. Download service account key from Firebase Console
2. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
   ```
3. Run:
   ```bash
   node scripts/createAdminSimple.js
   ```

## 🆘 Still Having Issues?

1. **Check Firebase project**: Make sure you're in the right project (mtcaramelhelps)
2. **Check Authentication is enabled**: Firebase Console > Authentication > Sign-in method
3. **Check Firestore rules**: Make sure they allow user creation
4. **Verify .env.local**: Ensure Firebase config is correct

## 📞 Need Help?
If you're still having trouble, let me know which step is failing and I can help troubleshoot further.
