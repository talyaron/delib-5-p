import { store } from "../../../model/store";
import { User } from "delib-npm";
import { auth } from "../auth";

export function getUserFromFirebase(): User | null {
    try {
     
        const _user = auth.currentUser;
        if (!_user) throw new Error("User not logged in");

        const userStore = store.getState().user;
        if(!userStore) throw new Error("User not logged in");

        return userStore.user;

    } catch (error) {
        console.error(error)
        return null;
    }
}