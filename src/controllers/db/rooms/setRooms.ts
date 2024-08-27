import {
	Collections,
	Statement,
	ParticipantInRoom,
	getStatementSubscriptionId,
	RoomSettings,
} from "delib-npm";
import { deleteDoc, doc, runTransaction, setDoc } from "firebase/firestore";
import { DB } from "../config";


import { store } from "@/model/store";



export function setParticipantToDB(
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

		const roomRef = doc(DB, Collections.participants, participantInRoomId);

		setDoc(roomRef, participantInRoom, { merge: true });
	} catch (error) {
		console.error(error);
	}
}

export function deleteParticipantToDB(
	statement: Statement
): void {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error("User not logged in");

		const roomId = getStatementSubscriptionId(statement.parentId, user);
		if (!roomId) throw new Error("Room id is undefined");

		const roomRef = doc(DB, Collections.participants, roomId);

		deleteDoc(roomRef);
	} catch (error) {
		console.error(error);
	}
}


export async function toggleRoomEditingInDB(statementId: string): Promise<void> {
	try {
		const roomSettingsRef = doc(DB, Collections.roomsSettings, statementId);
		//use transaction
		await runTransaction(DB, async (transaction) => {
			try {
				const roomSettings = (await transaction.get(roomSettingsRef)).data() as RoomSettings;
				if (!roomSettings) {
					transaction.set(roomSettingsRef, { 
						statementId,
						isEdit: false,
						timers:[]

					});
				} else {
				
					transaction.update(roomSettingsRef, { isEdit: !roomSettings.isEdit });
				}
			} catch (error) {
				console.error(error);
			}
		});

	} catch (error) {
		console.error(error);
	}
}
