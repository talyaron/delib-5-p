import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { DB } from "../config";
import { Collections } from "delib-npm";
import { getNumberDigits } from "../../general/helpers";

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