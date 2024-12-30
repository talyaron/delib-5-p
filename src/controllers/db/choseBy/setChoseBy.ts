import { ChoseBy, Collections } from "delib-npm";
import { FireStore } from "../config";
import { doc, setDoc } from "firebase/firestore/lite";


export async function setChoseByToDB(choseBy: ChoseBy) {
	try {
		const choseByRef = doc(FireStore, Collections.choseBy, choseBy.statementId);
		await setDoc(choseByRef, choseBy);
	} catch (error) {
		console.error(error);
	}
}