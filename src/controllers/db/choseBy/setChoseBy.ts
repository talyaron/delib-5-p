import { ChoseBy, Collections } from "delib-npm";
import { DB } from "../config";
import { doc, setDoc } from "firebase/firestore";


export async function setChoseByToDB(choseBy: ChoseBy) {
	try {
		console.log("setChoseByToDB", choseBy);
		const choseByRef = doc(DB, Collections.choseBy, choseBy.statementId);
		await setDoc(choseByRef, choseBy);
	} catch (error) {
		console.error(error);
	}
}