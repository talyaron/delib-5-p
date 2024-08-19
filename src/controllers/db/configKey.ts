// const mode = import.meta.env.VITE_APP_ENV as 'development' | 'production';
const mode = 'production';

console.info('mode', mode);

const firebaseConfig = {
	development: {
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY_DEV,
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV,
		databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL_DEV,
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_DEV,
		storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEV,
		messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV,
		appId: import.meta.env.VITE_FIREBASE_APP_ID_DEV,
		measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_DEV,
	},
	production: {
		apiKey: "AIzaSyBEumZUTCL3Jc9pt7_CjiSVTxmz9aMqSvo",
		authDomain: "synthesistalyaron.firebaseapp.com",
		databaseURL: "https://synthesistalyaron.firebaseio.com",
		projectId: "synthesistalyaron",
		storageBucket: "synthesistalyaron.appspot.com",
		messagingSenderId: "799655218679",
		appId: "1:799655218679:web:df35fdf8156d365bb9b2f2",
		measurementId: "G-RWHD4T98X6"
	},
};

const vapidKeys = {
	development: import.meta.env.VITE_FIREBASE_VAPID_KEY_DEV,
	production: import.meta.env.VITE_FIREBASE_VAPID_KEY_PROD,
};

export const vapidKey = vapidKeys[mode];

export default firebaseConfig[mode];
