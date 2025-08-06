import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface SupplyItem {
  id: string;
  name: string;
  unit: string;
  available_quantity: number;
}

export interface SupplyPickup {
  id?: string;
  org_name: string;
  supply_item_id: string;
  supply_item_name?: string;
  quantity: number;
  unit: string;
  signature_url: string;
  timestamp: Timestamp;
  issued_by: string;
  issued_by_email?: string;
}

// Supply Items Management
export const addSupplyItem = async (item: Omit<SupplyItem, 'id'>) => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    const docRef = await addDoc(collection(db, 'supply_items'), item);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getSupplyItems = async (): Promise<SupplyItem[]> => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    const querySnapshot = await getDocs(collection(db, 'supply_items'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SupplyItem));
  } catch (error) {
    throw error;
  }
};

export const updateSupplyItemQuantity = async (itemId: string, newQuantity: number) => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    const itemRef = doc(db, 'supply_items', itemId);
    await updateDoc(itemRef, { available_quantity: newQuantity });
  } catch (error) {
    throw error;
  }
};

// Supply Pickups Management
export const submitSupplyPickup = async (
  pickup: Omit<SupplyPickup, 'id' | 'timestamp'>,
  signatureBlob: Blob
) => {
  try {
    if (!db || !storage) {
      throw new Error('Firebase not initialized');
    }
    // Upload signature to Firebase Storage
    const signatureRef = ref(storage, `signatures/${Date.now()}_signature.png`);
    await uploadBytes(signatureRef, signatureBlob);
    const signatureUrl = await getDownloadURL(signatureRef);

    // Create pickup record
    const pickupData = {
      ...pickup,
      signature_url: signatureUrl,
      timestamp: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'supply_pickups'), pickupData);
    
    // Update supply item quantity
    const supplyItems = await getSupplyItems();
    const supplyItem = supplyItems.find(item => item.id === pickup.supply_item_id);
    if (supplyItem) {
      const newQuantity = Math.max(0, supplyItem.available_quantity - pickup.quantity);
      await updateSupplyItemQuantity(pickup.supply_item_id, newQuantity);
    }

    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getSupplyPickups = async (userId?: string): Promise<SupplyPickup[]> => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    let q;
    if (userId) {
      q = query(
        collection(db, 'supply_pickups'),
        where('issued_by', '==', userId),
        orderBy('timestamp', 'desc')
      );
    } else {
      q = query(
        collection(db, 'supply_pickups'),
        orderBy('timestamp', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SupplyPickup));
  } catch (error) {
    throw error;
  }
};

// Initialize default supply items
export const initializeDefaultSupplyItems = async () => {
  try {
    const existingItems = await getSupplyItems();
    if (existingItems.length === 0) {
      const defaultItems = [
        { name: 'Notebooks', unit: 'individual', available_quantity: 100 },
        { name: 'Pencils', unit: 'box', available_quantity: 50 },
        { name: 'Pens', unit: 'box', available_quantity: 30 },
        { name: 'Erasers', unit: 'individual', available_quantity: 75 },
        { name: 'Rulers', unit: 'individual', available_quantity: 40 },
        { name: 'Glue Sticks', unit: 'individual', available_quantity: 60 },
        { name: 'Colored Pencils', unit: 'box', available_quantity: 25 },
        { name: 'Markers', unit: 'box', available_quantity: 20 },
        { name: 'Copy Paper', unit: 'ream', available_quantity: 15 },
        { name: 'Folders', unit: 'individual', available_quantity: 80 },
        { name: 'Binders', unit: 'individual', available_quantity: 35 },
        { name: 'Highlighters', unit: 'individual', available_quantity: 45 },
        { name: 'Scissors', unit: 'individual', available_quantity: 30 },
        { name: 'Staplers', unit: 'individual', available_quantity: 20 },
        { name: 'Staples', unit: 'box', available_quantity: 40 },
        { name: 'Index Cards', unit: 'pack', available_quantity: 50 },
        { name: 'Sticky Notes', unit: 'pack', available_quantity: 60 },
        { name: 'Calculators', unit: 'individual', available_quantity: 25 },
        { name: 'Backpacks', unit: 'individual', available_quantity: 40 },
        { name: 'Lunch Boxes', unit: 'individual', available_quantity: 30 },
      ];

      for (const item of defaultItems) {
        await addSupplyItem(item);
      }
    }
  } catch (error) {
    console.error('Error initializing default supply items:', error);
  }
};
