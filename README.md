# Mt. Caramel H.E.L.P.S. - School Supply Tracking Application

A comprehensive Next.js web application designed to manage school supply distribution with digital signatures, role-based access control, and real-time inventory tracking.

## 🚀 Features

### Core Functionality
- **Landing Page**: Professional homepage for the Mt. Caramel H.E.L.P.S. application suite
- **Firebase Authentication**: Secure email/password authentication with role-based access
- **Supply Pickup Form**: Digital form with electronic signature capture
- **Inventory Management**: Real-time tracking of supply items and quantities
- **Role-Based Dashboards**: Different interfaces for clients, power users, and admins
- **User Management**: Admin panel for managing user roles and permissions

### User Roles
- **Client**: Submit supply pickup forms and view personal history
- **Power User**: Administrative duties, inventory management, view all pickups
- **Admin**: Full system access, user management, role assignment

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI Framework**: Bootstrap 5.3
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **File Storage**: Firebase Storage
- **Signature Capture**: react-signature-canvas

## 📋 Prerequisites

- Node.js 18+ 
- Firebase project with Authentication, Firestore, and Storage enabled
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MtCaramel_HELPS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication with Email/Password provider
   - Create a Firestore database
   - Enable Firebase Storage
   - Get your Firebase configuration

4. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Firestore Security Rules**
   
   Set up the following security rules in your Firestore:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['power_user', 'admin'];
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // Supply items collection
       match /supply_items/{itemId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['power_user', 'admin'];
       }
       
       // Supply pickups collection
       match /supply_pickups/{pickupId} {
         allow read, write: if request.auth != null && resource.data.issued_by == request.auth.uid;
         allow read, write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['power_user', 'admin'];
       }
     }
   }
   ```

6. **Firebase Storage Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /signatures/{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 🚀 Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 📊 Database Schema

### Collections

#### users
```typescript
{
  uid: string;
  email: string;
  role: 'client' | 'power_user' | 'admin';
  createdAt: Timestamp;
}
```

#### supply_items
```typescript
{
  name: string;
  unit: string;
  available_quantity: number;
}
```

#### supply_pickups
```typescript
{
  org_name: string;
  supply_item_id: string;
  supply_item_name: string;
  quantity: number;
  unit: string;
  signature_url: string;
  timestamp: Timestamp;
  issued_by: string;
  issued_by_email: string;
}
```

## 🎯 Usage

### For Clients
1. Sign up with email/password (default role: client)
2. Access the Supply Tracker to submit pickup forms
3. Fill out organization details, select items, and provide digital signature
4. View pickup history in the dashboard

### For Power Users
1. All client functionality
2. Access inventory management to add/edit supply items
3. View all pickup submissions from all users
4. Monitor stock levels and low inventory alerts

### For Admins
1. All power user functionality
2. Access admin panel for user management
3. Promote users to power_user or admin roles
4. View system statistics and user analytics

## 🔐 Security Features

- Firebase Authentication with email verification
- Role-based access control with route protection
- Firestore security rules for data protection
- Secure file upload for digital signatures
- Environment variable protection for sensitive data

## 🎨 UI/UX Features

- Responsive Bootstrap design
- Professional branding and color scheme
- Loading states and error handling
- Accessible form controls and navigation
- Mobile-friendly interface

## 🔄 Future Enhancements

- Email notifications for low inventory
- Advanced reporting and analytics
- Bulk import/export functionality
- Multi-organization support
- API integrations
- Mobile app development

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify environment variables are correctly set
   - Check Firebase project configuration
   - Ensure Firestore and Storage are enabled

2. **Authentication Issues**
   - Confirm Email/Password provider is enabled in Firebase Auth
   - Check security rules in Firestore

3. **Signature Upload Failures**
   - Verify Firebase Storage is enabled
   - Check storage security rules

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Mt. Caramel H.E.L.P.S.** - Helping Everyone Learn, Progress, and Succeed
