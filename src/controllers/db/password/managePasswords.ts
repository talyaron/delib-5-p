import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { DB } from '../config';
import { where } from 'firebase/firestore/lite';

export interface Password {
	password: string;
	expiryDate: Date;
	statementId: string;
	passwordId: string;
}

// Function generates a 4 number password for a statement and sets an expiry date for the password
export function generatePasswordForStatement(statementId: string): Password {
	const password = Math.floor(1000 + Math.random() * 9000).toString();
	const expiryDate = new Date();
	expiryDate.setSeconds(expiryDate.getSeconds() + 10);

	const passwordObj: Password = {
		password,
		expiryDate,
		statementId,
		passwordId: crypto.randomUUID(),
	};

	return passwordObj;
}

export function isPasswordCorrect(
	password: Password,
	inputPassword: string
): boolean {
	return password.password === inputPassword;
}

export async function setPasswordInDB(statementId: string): Promise<Password> {
	const collectionRef = collection(DB, 'passwords');

	const q = query(collectionRef, where('statementId', '==', statementId));

	const querySnapshot = await getDocs(q);

	// If a password already exists for the statement, update the existing password
	if (!querySnapshot.empty) {
		const d = querySnapshot.docs[0];

		const password = d.data() as Password;
		const newPassword = generatePasswordForStatement(statementId);

		const passwordRef = doc(DB, 'passwords', password.passwordId);

		await setDoc(passwordRef, newPassword, { merge: true });

		return password;
	} else {
		const newPassword = generatePasswordForStatement(statementId);

		const passwordRef = doc(DB, 'passwords', newPassword.passwordId);

		await setDoc(passwordRef, newPassword);

		return newPassword;
	}
}

export async function getPasswordFromDB(
	statementId: string
): Promise<Password | null> {
	// Replace "yourCollectionName" with your actual collection name
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
}

export async function passwordIsValid(
	statementId: string
): Promise<{ valid: boolean; password: Password }> {
	const password = await getPasswordFromDB(statementId);

	if (!password) {
		const newPassword = await setPasswordInDB(statementId);

		return { valid: true, password: newPassword };
	}

	return {
		valid: password.expiryDate > new Date(),
		password,
	};
}

export async function getPasswordFlow(statementId: string): Promise<Password> {
	const isValid = await passwordIsValid(statementId);

	if (!isValid.valid) {
		const newPassword = await setPasswordInDB(statementId);

		return newPassword;
	}

	return isValid.password;
}
