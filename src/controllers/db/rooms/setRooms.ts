import {
	Collections,
	Statement,
	ParticipantInRoom,
	getStatementSubscriptionId,
} from "delib-npm";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { DB } from "../config";


import { store } from "@/model/store";



export function setRoomJoinToDB(
	statement: Statement,
	roomNumber?: number
): void {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error("User not logged in");

		const participantInRoomId = getStatementSubscriptionId(statement.parentId, user);
		if (!participantInRoomId) throw new Error("Participant in room id is undefined");

		const participantInRoom: ParticipantInRoom = {
			user: user,
			statement,
			participantInRoomId
		};
		if (roomNumber) participantInRoom.roomNumber = roomNumber;
		
		const roomRef = doc(DB, Collections.rooms, participantInRoomId);

		setDoc(roomRef, participantInRoom, { merge: true });
	} catch (error) {
		console.error(error);
	}
}

export function deleteRoomJoinFromDB(
	statement: Statement
): void {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error("User not logged in");

		const roomId = getStatementSubscriptionId(statement.parentId, user);
		if (!roomId) throw new Error("Room id is undefined");

		const roomRef = doc(DB, Collections.rooms, roomId);

		deleteDoc(roomRef);
	} catch (error) {
		console.error(error);
	}
}

