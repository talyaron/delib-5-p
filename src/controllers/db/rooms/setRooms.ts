import {
	Collections,
	Statement,
	ParticipantInRoom,
	getStatementSubscriptionId,
	RoomSettings,
	ParticipantInRoomSchema,
	roomSettingsSchema,
} from "delib-npm";
import { deleteDoc, doc, getDoc, runTransaction, setDoc, updateDoc, writeBatch } from "firebase/firestore";
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

		ParticipantInRoomSchema.parse(participantInRoom);

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
						timers: []

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

export async function setNewRoomSettingsToDB(statementId: string): Promise<void> {
	try {
		const roomSettingsRef = doc(DB, Collections.roomsSettings, statementId);

		const roomSettingsDB = await getDoc(roomSettingsRef);
		if (roomSettingsDB.exists()) return;

		const roomSettings: RoomSettings = {
			statementId,
			isEdit: true,
			timers: [],
			participantsPerRoom: 7,
		};
		roomSettingsSchema.parse(roomSettings);
		
		setDoc(roomSettingsRef, roomSettings, { merge: true });
	} catch (error) {
		console.error(error);
	}
}

export async function setParticipantsPerRoom({ statementId, add, number }: { statementId: string, add?: number, number?: number }): Promise<void> {
	try {
		if (!number && !add) throw new Error("number or add must be defined");

		const roomSettingsRef = doc(DB, Collections.roomsSettings, statementId);

		if (number && number >= 1) {
			updateDoc(roomSettingsRef, { participantsPerRoom: number });

			return;
		}

		if (typeof add !== "number") throw new Error("add is not a number");

		//use transaction
		await runTransaction(DB, async (transaction) => {
			try {
				const roomSettings = (await transaction.get(roomSettingsRef)).data() as RoomSettings;
				if (!roomSettings) throw new Error("Room settings not found");
				const participantsPerRoom = roomSettings.participantsPerRoom || 7;

				if (participantsPerRoom + add < 1) return;

				transaction.update(roomSettingsRef, { participantsPerRoom: participantsPerRoom + add });

			} catch (error) {
				console.error(error);
			}
		});

	} catch (error) {
		console.error(error);
	}
}

export async function divideParticipantIntoRoomsToDB(topics: Statement[], participants: ParticipantInRoom[], participantsPerRoom: number): Promise<void> {
	try {
		const _topics = [...topics];
		const _participants = [...participants];

		const batch = writeBatch(DB);
		let roomNumber = 1;

		_topics.forEach((topic) => {
			const participantsInTopic = _participants.filter((participant) => participant.statement.statementId === topic.statementId);
			participantsInTopic.sort(() => Math.random() - 0.5);
			const numberOfRooms = Math.ceil(participantsInTopic.length / participantsPerRoom);
			const topRoomNumber = roomNumber + (numberOfRooms - 1);
			const initialRoomNumber = roomNumber;
			let localRoomNumber = roomNumber;


			participantsInTopic.forEach((participant) => {

				const participantRef = doc(DB, Collections.participants, participant.participantInRoomId);

				batch.update(participantRef, { roomNumber: localRoomNumber });

				localRoomNumber++;

				if (localRoomNumber > topRoomNumber) localRoomNumber = initialRoomNumber;
			});
			roomNumber = topRoomNumber + 1;

		});

		await batch.commit();

	} catch (error) {
		console.error(error)
	}

}

export async function clearRoomsToDB(participants: ParticipantInRoom[]): Promise<void> {
	try {

		const batch = writeBatch(DB);
		participants.forEach((participant) => {
			const participantRef = doc(DB, Collections.participants, participant.participantInRoomId);
			batch.update(participantRef, { roomNumber: 0 });
		});

		await batch.commit();

	} catch (error) {
		console.error(error);
	}
}
