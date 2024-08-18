import { Dispatch, SetStateAction } from "react";
import { getMaxInvitationDigits } from "@/controllers/db/invitations/getInvitations";

//search for max digits on invitations

export async function handleGetMaxInvitationDigits( setNumberOfDigits:Dispatch<SetStateAction<number>>) {
	try {
		const numberOfDigits = await getMaxInvitationDigits();
		if(!numberOfDigits) throw new Error("No number of digits found");

		setNumberOfDigits(numberOfDigits);
	} catch (error) {
		console.error(error);
	}
}