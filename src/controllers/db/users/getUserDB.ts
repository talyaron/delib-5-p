import { Agreement, Collections, StatementSchema, User, UserSettings, userSettingsSchema } from "delib-npm";
import { doc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { FireStore } from "../config";
import { store } from "@/model/store";
import { setUserSettings } from "@/model/users/userSlice";

// get user font size and update document and html with the size in the FireStore
export async function getUserFromDB(): Promise<User | undefined> {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error("user is not logged in");

		const userRef = doc(FireStore, Collections.users, user.uid);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) throw new Error("user does not exist");

		const userDB = userDoc.data() as User;

		if (!userDB) throw new Error("userDB is undefined");
		StatementSchema.parse(userDB);

		if (
			userDB.fontSize === undefined ||
			typeof userDB.fontSize !== "number" ||
			isNaN(userDB.fontSize)
		)
			userDB.fontSize = 14;
		if (typeof userDB.fontSize !== "number")
			throw new Error("fontSize is not a number");

		return userDB;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}

export interface SignatureDB {
	agreement: string;
	version: string;
}

export function getSignature(
	version = "basic",
	t: (text: string) => string,
): Agreement | undefined {
	try {
		const agreement: Agreement = {
			text: t("Agreement Description"),
			version,
			date: new Date().getTime(),
		};

		return agreement;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}

export function listenToUserSettings(): Unsubscribe {
	try {

		const user = store.getState().user.user;
		if (!user) throw new Error("user is not logged in");

		const userSettingsRef = doc(FireStore, Collections.usersSettings, user.uid);
		
		return onSnapshot(userSettingsRef, (settingsDB) => {
			const userSettings = settingsDB.data() as UserSettings;
			
			if (userSettings) {
				userSettingsSchema.parse(userSettings);
				store.dispatch(setUserSettings(userSettings));
				
				return

			}

			store.dispatch(setUserSettings(null));

		});

	} catch (error) {
		console.error(error);
		store.dispatch(setUserSettings(null));
		
		return () => { return };

	}
}