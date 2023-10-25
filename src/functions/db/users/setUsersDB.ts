import { Collections, User, UserSchema } from "delib-npm";
import { DB } from "../config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../auth";

export async function setUserToDB(user:User) {
    try {
       
        UserSchema.parse(user);
        const userRef = doc(DB, Collections.users, user.uid);
        await setDoc(userRef, user, { merge: true });
        const userFromDB = await getDoc(userRef);
        return userFromDB.data();
    } catch (error) {
        console.error(error)
    }
}

export async function updateUserFontSize(size:number) {
    try {
        const user = auth.currentUser;
        if(!user) throw new Error('user is not logged in');
        if(typeof size !== 'number') throw new Error('size must be a number');
        if(!user.uid) throw new Error('uid is required');
        if(size<0) throw new Error('size must be positive')
       
        const userRef = doc(DB, Collections.users, user.uid);
        await setDoc(userRef, {fontSize:size}, { merge: true }) 
        
    } catch (error) {
        console.error(error)
    }
}