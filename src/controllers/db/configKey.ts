const mode = import.meta.env.VITE_APP_ENV as 'development' | 'production';

console.info("mode", mode);
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
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY_PROD,
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PROD,
		databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL_PROD,
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_PROD,
		storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PROD,
		messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_PROD,
		appId: import.meta.env.VITE_FIREBASE_APP_ID_PROD,
		measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_PROD,
	},
};

const vapidKeys = {
	development: import.meta.env.VITE_FIREBASE_VAPID_KEY_DEV,
	production: import.meta.env.VITE_FIREBASE_VAPID_KEY_PROD,
};

export const vapidKey = vapidKeys[mode];

export default firebaseConfig[mode];
