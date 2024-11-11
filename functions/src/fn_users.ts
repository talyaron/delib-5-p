import { Collections, User, UserSettings } from 'delib-npm';
import { db } from '.';

export async function setUserSettings(e: any) {
	try {
		const user = e.data.data() as User;
		const { uid } = user;
		if (!uid) throw new Error('uid not found');
		const userSettings: UserSettings = {
			userId: uid,
			learning: {
				evaluation: 7,
				addOptions: 3,
			},
		};

		const userSettingsRef = db.doc(`${Collections.usersSettings}/${uid}`);
		await userSettingsRef.set(userSettings);
		return;
	} catch (error) {
		console.error(error);
		return;
	}
}
