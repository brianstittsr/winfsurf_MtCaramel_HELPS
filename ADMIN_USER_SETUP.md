# Admin User Setup Guide

This guide explains how to create an admin user for the Mt. Caramel H.E.L.P.S. application.

## 📋 Admin User Credentials

- **Username**: admin
- **Email**: admin@mtcaramelhelps.com  
- **Password**: admin123
- **Role**: admin

⚠️ **Important**: Change the password after first login!

## 🚀 Quick Setup (Recommended)

Run the admin user data generator:

```bash
npm run generate:admin
```

This will display the manual setup instructions and create an import file.

## 🔧 Manual Setup Methods

### Method 1: Firebase Console (Manual)

1. **Create Authentication User**:
   - Go to [Firebase Console > Authentication > Users](https://console.firebase.google.com/u/0/project/mtcaramelhelps/authentication/users)
   - Click "Add user"
   - Email: `admin@mtcaramelhelps.com`
   - Password: `admin123`
   - Click "Add user"
   - **Copy the generated UID** - you'll need it for the next step

2. **Create Firestore Document**:
   - Go to [Firebase Console > Firestore Database](https://console.firebase.google.com/u/0/project/mtcaramelhelps/firestore/data)
   - Navigate to the `users` collection (create it if it doesn't exist)
   - Click "Add document"
   - Document ID: **Use the UID from step 1**
   - Add these fields:
     ```
     uid: [string] - The UID from Firebase Auth
     email: [string] - admin@mtcaramelhelps.com
     username: [string] - admin
     role: [string] - admin
     createdAt: [timestamp] - Current date/time
     ```

### Method 2: Firebase CLI Import

If you have Firebase CLI set up with proper authentication:

```bash
# Use the generated import file
firebase auth:import admin-user-import.json --project mtcaramelhelps
```

### Method 3: Automated Script (Requires Firebase Setup)

If you have Firebase SDK properly configured with valid API keys:

```bash
npm run create:admin
```

**Note**: This requires valid Firebase configuration in `.env.local`

## 🔍 Verification

After creating the admin user, verify the setup:

1. **Check Authentication**: User should appear in Firebase Console > Authentication > Users
2. **Check Firestore**: User document should exist in `users` collection with `role: "admin"`
3. **Test Login**: Try logging into the application with the admin credentials

## 🛠️ Troubleshooting

### "Invalid API Key" Error
- Update `.env.local` with correct Firebase configuration values
- Get values from [Firebase Console > Project Settings](https://console.firebase.google.com/u/0/project/mtcaramelhelps/settings/general)

### "Permission Denied" Error  
- Ensure Firestore security rules allow user creation
- Check that Firebase Authentication is enabled

### User Already Exists
- If you see "email-already-in-use" error, the admin user already exists
- You can reset the password in Firebase Console > Authentication > Users

## 📁 Generated Files

- `admin-user-import.json` - Firebase CLI import file (created by `npm run generate:admin`)

## 🔐 Security Notes

1. **Change the default password** immediately after first login
2. Consider enabling 2FA for the admin account
3. The admin role has full access to the system - use responsibly
4. Regularly audit admin user activities

## 📞 Support

If you encounter issues:
1. Check the Firebase Console for error messages
2. Verify your Firebase project configuration
3. Ensure all required Firebase services are enabled (Authentication, Firestore)
