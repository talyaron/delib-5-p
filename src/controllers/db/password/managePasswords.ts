import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { DB } from '../config';

export interface Password {
	password: string;
	expiryDate: number;
	statementId: string;
	passwordId: string;
}

const passwordExpiredAfter = 10000;

const isPasswordExpired = (expiryDate: number): boolean => {
	return expiryDate < new Date().getTime();
};

// Function generates a 4 number password for a statement and sets an expiry date for the password
export function generatePasswordForStatement(statementId: string): Password {
	const password = Math.floor(1000 + Math.random() * 9000).toString();
	const expiryDate = new Date().getTime() + passwordExpiredAfter;

	const passwordObj: Password = {
		password,
		expiryDate,
		statementId,
		passwordId: crypto.randomUUID(),
	};

	return passwordObj;
}

export async function setPasswordInDB(statementId: string): Promise<Password> {
	try {
		const collectionRef = collection(DB, 'passwords');

		const q = query(collectionRef, where('statementId', '==', statementId));

		const querySnapshot = await getDocs(q);

		// If a password already exists for the statement, update the existing password
		if (!querySnapshot.empty) {
			const d = querySnapshot.docs[0];

			const passwordDB = d.data() as Password;

			// If the password has expired, generate a new password and update the expiry date
			if (isPasswordExpired(passwordDB.expiryDate)) {
				const { password, expiryDate } =
					generatePasswordForStatement(statementId);

				const passwordRef = doc(DB, 'passwords', statementId);

				await setDoc(passwordRef, { password, expiryDate }, { merge: true });

				return {
					password,
					expiryDate,
					statementId,
					passwordId: passwordDB.passwordId,
				};
			}

			return passwordDB;
		} else {
			const newPassword = generatePasswordForStatement(statementId);

			const passwordRef = doc(DB, 'passwords', statementId);

			await setDoc(passwordRef, newPassword);

			return newPassword;
		}
	} catch (error) {
		console.error('Error setting password in DB:', error);
		throw new Error('Error setting password in DB');
	}
}

export async function getPasswordFromDB(
	statementId: string
): Promise<Password | null> {
	try {
		const collectionRef = collection(DB, 'passwords');

		// Create a query to find documents where statementId matches the provided ID
		const q = query(collectionRef, where('statementId', '==', statementId));

		// Get the documents that match the query
		const querySnapshot = await getDocs(q);

		// If a password already exists for the statement, update the existing password
		if (!querySnapshot.empty) {
			const password = querySnapshot.docs[0].data() as Password;

			return password;
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error getting password from DB:', error);
		throw new Error('Error getting password from DB');
	}
}

// When the admin requests a password for a statement to send to users
export async function providePasswordToAdmin(
	statementId: string
): Promise<Password> {
	const password = await getPasswordFromDB(statementId);

	if (!password || isPasswordExpired(password.expiryDate)) {
		const newPassword = await setPasswordInDB(statementId);

		return newPassword;
	}

	return password;
}

export async function checkIfPasswordMatchesInDB(
	statementId: string,
	inputPassword: string
): Promise<boolean> {
	const password = await getPasswordFromDB(statementId);

	return password ? password.password === inputPassword : false;
}
