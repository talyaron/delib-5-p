import { doc, getDoc } from "firebase/firestore";
import { auth } from "../auth";
import { Collections, User } from "delib-npm";
import { DB } from "../config";

// get user font size and update document and html with the size in the DB
export async function getUserFromDB(): Promise<User |undefined> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('user is not logged in');

        const userRef = doc(DB, Collections.users, user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) throw new Error('user does not exist');

        const userDB = userDoc.data() as User;

        if (!userDB) throw new Error('userDB is undefined');
        if (userDB.fontSize === undefined || typeof userDB.fontSize !== 'number' || isNaN(userDB.fontSize)) userDB.fontSize = 14;
        if (typeof userDB.fontSize !== 'number') throw new Error('fontSize is not a number');


        return userDB;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}