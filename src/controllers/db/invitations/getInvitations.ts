import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { DB } from "../config";
import { Collections } from "delib-npm";
import { getNumberDigits } from "@/controllers/general/helpers";

export async function getMaxInvitationDigits():Promise<number | undefined>{
	try {
		const invitationsRef = collection(DB, Collections.invitations);
		const q = query(invitationsRef, where("lastUpdate", ">", new Date().getTime() - 24 * 60 * 60 * 1000), orderBy("number", "desc"), limit(1));
		const numbers = await getDocs(q);
		const maxNumber = numbers.docs[0].data().number;
		if(!maxNumber) throw new Error("No max number found");
		const numberDigits = getNumberDigits(maxNumber);
		
		return numberDigits;

	} catch (error) {
		console.error(error);
		
		return undefined; 
	}
}

export async function getInvitationPathName(number:number):Promise<string | undefined>{
	try {
		if(!number) throw new Error("No number");
		if(typeof number !== "number") number = Number(number);
	
		const invitationsRef = collection(DB, Collections.invitations);
		const q = query(invitationsRef, where("number", "==", number), where("lastUpdate", ">", new Date().getTime() - 24 * 60 * 60 * 1000), orderBy("number", "desc"), limit(1));
		const numbersDB = await getDocs(q);
		const numbers = numbersDB.docs.map(doc => doc.data());
		
		if(numbers.length === 0) throw new Error("No number found in DB");
		const {pathname} = numbers[0];
		if(!pathname) throw new Error("No path name found");
		
		return pathname;

	} catch (error) {
		console.error(error);
		
		return undefined; 
	}
}

//where("lastUpdate", ">", new Date().getTime() - 24 * 60 * 60 * 1000)