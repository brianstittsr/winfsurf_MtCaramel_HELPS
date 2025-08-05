import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { UserRole, UserData } from './auth';

export interface UserWithId extends UserData {
  id: string;
}

export const getAllUsers = async (): Promise<UserWithId[]> => {
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserWithId));
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
  } catch (error) {
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const users = await getAllUsers();
    
    const stats = {
      total: users.length,
      clients: users.filter(user => user.role === 'client').length,
      powerUsers: users.filter(user => user.role === 'power_user').length,
      admins: users.filter(user => user.role === 'admin').length,
    };
    
    return stats;
  } catch (error) {
    throw error;
  }
};
