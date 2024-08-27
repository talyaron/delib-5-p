import {
	Collections,
	Statement,
	ParticipantInRoom,
	getStatementSubscriptionId,
} from "delib-npm";
import { doc, setDoc } from "firebase/firestore";
import { DB } from "../config";


import { store } from "@/model/store";



export function setRoomJoinToDB(
	statement: Statement,
	roomNumber?: number
): void {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error("User not logged in");

		const participantInRoom: ParticipantInRoom = {
			user: user,
			statement
		};
		if (roomNumber) participantInRoom.roomNumber = roomNumber;
		const roomId = getStatementSubscriptionId(statement.statementId, user)
		if (!roomId) throw new Error("Room id is undefined");
		const roomRef = doc(DB, Collections.rooms, roomId);

		setDoc(roomRef, participantInRoom, { merge: true });
	} catch (error) {
		console.error(error);
	}
}


