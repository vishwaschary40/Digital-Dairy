import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc,
    deleteDoc,
    Timestamp
} from "firebase/firestore";
import { db } from "./config";

// Generic types
export interface FirestoreData {
    id?: string;
    [key: string]: any;
}

// Helpers
export const getDocument = async <T = FirestoreData>(collectionName: string, id: string): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert Firestore Timestamps to ISO strings
        const processedData = Object.keys(data).reduce((acc, key) => {
            const value = data[key];
            if (value && typeof value === 'object' && 'toDate' in value) {
                acc[key] = (value as Timestamp).toDate().toISOString();
            } else if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                acc[key] = value;
            } else {
                acc[key] = value;
            }
            return acc;
        }, {} as any);
        return { id: docSnap.id, ...processedData } as T;
    } else {
        return null;
    }
};

export const getCollection = async (collectionName: string, constraints: any[] = []) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamps to ISO strings
        const processedData = Object.keys(data).reduce((acc, key) => {
            const value = data[key];
            if (value && typeof value === 'object' && 'toDate' in value) {
                acc[key] = (value as Timestamp).toDate().toISOString();
            } else if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                acc[key] = value;
            } else {
                acc[key] = value;
            }
            return acc;
        }, {} as any);
        return { id: doc.id, ...processedData };
    });
};

export const addDocument = async (collectionName: string, id: string, data: any) => {
    // Convert date strings to Firestore Timestamps where needed
    const processedData = Object.keys(data).reduce((acc, key) => {
        const value = data[key];
        if (key === 'deadline' && typeof value === 'string') {
            acc[key] = Timestamp.fromDate(new Date(value));
        } else if (key === 'createdAt' || key === 'updatedAt') {
            acc[key] = value ? Timestamp.fromDate(new Date(value)) : Timestamp.now();
        } else {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
    await setDoc(doc(db, collectionName, id), processedData);
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
    const docRef = doc(db, collectionName, id);
    // Convert date strings to Firestore Timestamps where needed
    const processedData = Object.keys(data).reduce((acc, key) => {
        const value = data[key];
        if (key === 'deadline' && typeof value === 'string') {
            acc[key] = Timestamp.fromDate(new Date(value));
        } else if (key === 'updatedAt') {
            acc[key] = Timestamp.now();
        } else {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
    await updateDoc(docRef, processedData);
};

export const deleteDocument = async (collectionName: string, id: string) => {
    await deleteDoc(doc(db, collectionName, id));
};
