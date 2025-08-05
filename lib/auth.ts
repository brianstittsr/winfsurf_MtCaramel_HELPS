import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'client' | 'power_user' | 'admin';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export const signUp = async (email: string, password: string, role: UserRole = 'client') => {
  try {
    if (!auth || !db) {
      throw new Error('Firebase not initialized');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: role,
      createdAt: new Date(),
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const updateUserRole = async (uid: string, newRole: UserRole) => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    await setDoc(doc(db, 'users', uid), { role: newRole }, { merge: true });
  } catch (error) {
    throw error;
  }
};
