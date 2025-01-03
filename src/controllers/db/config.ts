// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import firebaseConfig from './configKey';
import { isProduction } from '../general/helpers';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const FireStore = getFirestore(app);
export const analytics = getAnalytics(app);
export const messaging = async () => (await isSupported()) && getMessaging(app);
export const storage = getStorage(app);
const auth = getAuth();

//development
if (!isProduction()) {
	console.warn('Running on development mode');

	connectFirestoreEmulator(FireStore, '127.0.0.1', 8080);
	connectAuthEmulator(auth, 'http://127.0.0.1:9099');
	connectStorageEmulator(storage, '127.0.0.1', 9199);
}
