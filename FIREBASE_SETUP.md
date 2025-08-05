# Firebase Setup Guide for Mt. Caramel H.E.L.P.S.

This guide will help you deploy the database schema and configure Firebase for the Mt. Caramel H.E.L.P.S. application.

## 🔧 Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Access to Firebase project: `mtcaramelhelps`
- Project URL: https://console.firebase.google.com/u/0/project/mtcaramelhelps/overview

## 📋 Step-by-Step Setup

### 1. Firebase CLI Authentication

```bash
# Login to Firebase CLI
firebase login

# Set the project
firebase use mtcaramelhelps
```

### 2. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/u/0/project/mtcaramelhelps/settings/general)
2. Click on "Project settings" (gear icon)
3. Scroll down to "Your apps" section
4. Click "Add app" → Web app (</>) if not already created
5. Copy the configuration object

### 3. Configure Environment Variables

Create `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mtcaramelhelps.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mtcaramelhelps
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mtcaramelhelps.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

### 4. Enable Firebase Services

#### Authentication
1. Go to [Authentication](https://console.firebase.google.com/u/0/project/mtcaramelhelps/authentication/providers)
2. Click "Get started"
3. Enable "Email/Password" provider
4. Optionally enable email verification

#### Firestore Database
1. Go to [Firestore Database](https://console.firebase.google.com/u/0/project/mtcaramelhelps/firestore)
2. Click "Create database"
3. Choose "Start in test mode" (we'll deploy security rules later)
4. Select your preferred location

#### Firebase Storage
1. Go to [Storage](https://console.firebase.google.com/u/0/project/mtcaramelhelps/storage)
2. Click "Get started"
3. Choose "Start in test mode"
4. Select the same location as Firestore

### 5. Deploy Security Rules

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Storage security rules
firebase deploy --only storage

# Deploy both at once
firebase deploy --only firestore,storage
```

### 6. Initialize Database with Default Data

```bash
# Install dependencies if not already done
npm install

# Run the database initialization script
npx ts-node scripts/initializeDatabase.ts
```

### 7. Create Initial Admin User

1. Start the development server: `npm run dev`
2. Go to the signup page
3. Create an account with role "admin"
4. This will be your initial admin account

## 📊 Database Schema

### Collections Structure

#### `users`
```typescript
{
  uid: string;           // Firebase Auth UID
  email: string;         // User email
  role: 'client' | 'power_user' | 'admin';
  createdAt: Timestamp;  // Account creation date
}
```

#### `supply_items`
```typescript
{
  name: string;              // Item name (e.g., "Notebooks")
  unit: string;              // Unit type (e.g., "individual", "box")
  available_quantity: number; // Current stock count
}
```

#### `supply_pickups`
```typescript
{
  org_name: string;          // Organization name
  supply_item_id: string;    // Reference to supply_items document
  supply_item_name: string;  // Cached item name
  quantity: number;          // Quantity picked up
  unit: string;              // Unit of measurement
  signature_url: string;     // Firebase Storage URL for signature
  timestamp: Timestamp;      // Pickup date/time
  issued_by: string;         // User UID who issued
  issued_by_email: string;   // Cached user email
}
```

## 🔐 Security Rules Explanation

### Firestore Rules
- **Users**: Can read/write own data; power users/admins can read all; only admins can modify roles
- **Supply Items**: All authenticated users can read; only power users/admins can modify
- **Supply Pickups**: Users can manage their own records; power users/admins can access all

### Storage Rules
- **Signatures**: Only authenticated users can read/write signature files

## 🚀 Deployment Commands

```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only firestore
firebase deploy --only storage
firebase deploy --only hosting

# Deploy with specific project
firebase deploy --project mtcaramelhelps
```

## 🧪 Testing the Setup

1. **Authentication Test**:
   - Create accounts with different roles
   - Verify role-based access control

2. **Supply Tracking Test**:
   - Submit pickup forms with signatures
   - Verify data appears in Firestore
   - Check signature files in Storage

3. **Inventory Test**:
   - Add/edit supply items (power user/admin)
   - Verify quantity updates after pickups

4. **Admin Functions Test**:
   - Change user roles (admin only)
   - View all user data and statistics

## 🔍 Monitoring and Maintenance

### Firebase Console Links
- [Authentication Users](https://console.firebase.google.com/u/0/project/mtcaramelhelps/authentication/users)
- [Firestore Data](https://console.firebase.google.com/u/0/project/mtcaramelhelps/firestore/data)
- [Storage Files](https://console.firebase.google.com/u/0/project/mtcaramelhelps/storage/files)
- [Usage Analytics](https://console.firebase.google.com/u/0/project/mtcaramelhelps/analytics)

### Regular Maintenance
- Monitor storage usage for signature files
- Review user roles and permissions
- Check for low inventory items
- Backup important data regularly

## 🆘 Troubleshooting

### Common Issues

1. **Permission Denied Errors**:
   - Verify security rules are deployed
   - Check user authentication status
   - Confirm user has correct role

2. **Environment Variable Issues**:
   - Verify `.env.local` file exists and has correct values
   - Restart development server after changes
   - Check for typos in variable names

3. **Signature Upload Failures**:
   - Verify Storage is enabled
   - Check storage security rules
   - Confirm CORS settings if needed

### Getting Help
- Check Firebase Console for error logs
- Review browser console for client-side errors
- Verify network connectivity to Firebase services

## ✅ Verification Checklist

- [ ] Firebase CLI authenticated and project selected
- [ ] Firebase configuration copied to `.env.local`
- [ ] Authentication enabled with Email/Password provider
- [ ] Firestore database created
- [ ] Firebase Storage enabled
- [ ] Security rules deployed successfully
- [ ] Default supply items initialized
- [ ] Initial admin user created
- [ ] Application running and functional
- [ ] All user roles tested
- [ ] Supply pickup form working with signatures
- [ ] Inventory management functional
- [ ] Admin panel accessible

---

**🎉 Once completed, your Mt. Caramel H.E.L.P.S. application will be fully deployed and ready for production use!**
