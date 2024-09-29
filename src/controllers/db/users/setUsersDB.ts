import {
	Agreement,
	AgreementSchema,
	Collections,
	User,
	UserSchema,
} from "delib-npm";
import { DB } from "../config";
import { doc, getDoc, runTransaction, setDoc } from "firebase/firestore";
import { store } from "@/model/store";

export async function setUserToDB(user: User) {
	try {
		if (!user) throw new Error("user is undefined");

		UserSchema.parse(user);
		const userRef = doc(DB, Collections.users, user.uid);
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

		const userRef = doc(DB, Collections.users, user.uid);
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

		const userRef = doc(DB, Collections.users, user.uid);
		await setDoc(userRef, { agreement }, { merge: true });

		return true;
	} catch (error) {
		console.error(error);

		return false;
	}
}


export async function decreesUserSettingsEvaluation(): Promise<boolean> {
	try {
		const user = store.getState().user.user;
		const userSettings = store.getState().user.userSettings;
		if(!userSettings) return true;
		if (!userSettings.learning || userSettings.learning.evaluation === undefined || userSettings.learning.evaluation <= 0) return true;
		if (!user) throw new Error("user is not logged in");
		if (!user.uid) throw new Error("uid is required");
		

		const userSettingsRef = doc(DB, Collections.usersSettings, user.uid);
		//transaction to update the evaluation number
		await runTransaction(DB, async (transaction) => {
			try {

				const userSettings = await transaction.get(userSettingsRef);
				if (!userSettings.exists()) return;
				const userSettingsData = userSettings.data();
				

				const evaluation = Number(userSettingsData.learning.evaluation);
				const addOptions = Number(userSettingsData.learning.addOptions);
				if (!evaluation || evaluation <= 0) return;
				

				transaction.update(userSettingsRef, {
					learning: {
						evaluation: evaluation - 1,
						addOptions
					}
				});
			} catch (error) {
				console.error(error);
			}
		});

		return true;
	} catch (error) {
		console.error(error);

		return false;
	}
}
