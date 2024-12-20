import { User } from "delib-npm";
import { store } from "@/model/store";

export function getUserFromFirebase(): User | null {
	try {
		const _user = store.getState().user.user as User;
		if (!_user) throw new Error("User not logged in");

		const userStore = store.getState().user;
		if (!userStore) throw new Error("User not logged in");

		return userStore.user;
	} catch (error) {
		console.error(error);

		return null;
	}
}
