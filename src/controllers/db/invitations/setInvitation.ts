import { Collections, Invitation } from "delib-npm";
import { addDoc, collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { DB } from "../config";


interface CreateInvitationProps {
    pathname: string;
    statementId: string;
}
export async function setInvitationToDB({ pathname, statementId }: CreateInvitationProps): Promise<Invitation | undefined> {
	try {
		if(!statementId) throw new Error("StatementId is missing");
		if(!pathname) throw new Error("Pathname is missing");

		const initialNumber = 1;

		//look for previous invitation with this number in the last 24 hours
		const invitationsRef = collection(DB, Collections.invitations);
		const q = query(invitationsRef, where("lastUpdate", ">", new Date().getTime() - 24 * 60 * 60 * 1000), orderBy("number", "desc"), limit(1));
		const numbers = await getDocs(q);
	
		if (numbers.size === 0) {


			const invitation: Invitation = {
				statementId: statementId,
				pathname: pathname,
				lastUpdate: new Date().getTime(),
				number: initialNumber,
			}
			addDoc(invitationsRef, invitation);
			
			return invitation;
		}
		const lastNumber = numbers.docs[0].data().number;
		const invitation: Invitation = {
			statementId: statementId,
			pathname: pathname,
			lastUpdate: new Date().getTime(),
			number: lastNumber + 1,
		}

		//check if there is an invitation with this statementId
		const q2 = query(invitationsRef, where("statementId", "==", statementId), where("lastUpdate", ">", new Date().getTime() - 24 * 60 * 60 * 1000), orderBy("number", "desc"), limit(1));
		const statementInvitations = await getDocs(q2);
		let lastNumber2 = 1;

		//if there is an invitation with this statementId, return the last number
		if (statementInvitations.size > 0) {
			lastNumber2 = statementInvitations.docs[0].data().number;
			invitation.number = lastNumber2;
			
			return invitation;
		}
		addDoc(invitationsRef, invitation);
		
		return invitation;
	} catch (error) {
		console.error(error);
		
		return undefined;
	}
}