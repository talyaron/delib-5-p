import {
	Agreement,
	AgreementSchema,
	Collections,
	User,
	UserSchema,
} from "delib-npm";
import { FireStore } from "../config";
import { doc, getDoc,  setDoc } from "firebase/firestore";
import { store } from "@/model/store";

export async function setUserToDB(user: User) {
	try {
		if (!user) throw new Error("user is undefined");

		UserSchema.parse(user);
		const userRef = doc(FireStore, Collections.users, user.uid);
		await setDoc(userRef, user, { merge: true });
		const userFromDB = await getDoc(userRef);

		return userFromDB.data();
	} catch (error) {
		console.error(error);
	}
}

export async function updateUserFontSize(size: number) {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error("user is not logged in");
		if (typeof size !== "number") throw new Error("size must be a number");
		if (!user.uid) throw new Error("uid is required");
		if (size < 0) throw new Error("size must be positive");

		const userRef = doc(FireStore, Collections.users, user.uid);
		await setDoc(userRef, { fontSize: size }, { merge: true });
	} catch (error) {
		console.error(error);
	}
}

export async function updateUserAgreement(
	agreement: Agreement,
): Promise<boolean> {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error("user is not logged in");
		if (!user.uid) throw new Error("uid is required");
		if (!agreement) throw new Error("agreement is required");
		AgreementSchema.parse(agreement);

		const userRef = doc(FireStore, Collections.users, user.uid);
		await setDoc(userRef, { agreement }, { merge: true });

		return true;
	} catch (error) {
		console.error(error);

		return false;
	}
}
