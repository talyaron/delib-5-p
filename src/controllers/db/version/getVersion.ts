import { doc, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { FireStore } from '../config';
import { updateVersion } from '@/appCont';

export async function getVersionFromDB(): Promise<string | undefined> {
	try {
		const versionRef = doc(FireStore, 'version', 'version');
		const versionDB = await getDoc(versionRef);
		if (!versionDB.exists()) return undefined;
		const version = versionDB.data().version;
		if (!version) throw new Error('version not found');

		return version;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}
export function listenToVersionFromDB(): Unsubscribe {
	try {
		const versionRef = doc(FireStore, 'version', 'version');

		return onSnapshot(versionRef, (versionDB) => {
			try {
				if (!versionDB.exists()) return;
				const version = versionDB.data().version;
				if (!version) throw new Error('version not found');

				updateVersion(version);
			} catch (error) {
				console.error(error);
			}
		});
	} catch (error) {
		console.error(error);

		return () => {
			return;
		};
	}
}
