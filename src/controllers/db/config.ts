// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { keys } from "./configKey";


const firebaseConfig = keys;

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const DB = getFirestore(app);
export const analytics = getAnalytics(app);
export const messaging = async () => (await isSupported()) && getMessaging(app);
export const storage = getStorage(app);
const auth = getAuth();

//development
if (location.hostname === "localhost") {
	console.warn("running on development mode");

	connectFirestoreEmulator(DB, "127.0.0.1", 8080);
	connectAuthEmulator(auth, "http://127.0.0.1:9099");
	connectStorageEmulator(storage, "127.0.0.1", 9199);
}
