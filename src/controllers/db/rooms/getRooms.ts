import {
	Collections,
	ParticipantInRoom,
	ParticipantInRoomSchema,
	RoomSettings,
	roomSettingsSchema,
	Statement
} from 'delib-npm';
import {
	collection,
	doc,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { DB } from '../config';
import { deleteRoom, setRoom, setRooms, setRoomSettings } from '@/model/rooms/roomsSlice';
import { Unsubscribe } from 'firebase/auth';
import { store } from '@/model/store';


export function listenToParticipants(
	statement: Statement,
): Unsubscribe {
	try {
		const dispatch = store.dispatch;
		const requestRef = collection(DB, Collections.participants);
		const q = query(requestRef, where('statement.parentId', '==', statement.statementId));

		return onSnapshot(q, (roomsDB) => {
			try {
				roomsDB.docChanges().forEach((change) => {

					const room = change.doc.data() as ParticipantInRoom;
					ParticipantInRoomSchema.parse(room);

					switch (change.type) {
					case 'added':
						dispatch(setRoom(room));
						break;
					case 'modified':
						dispatch(setRoom(room));
						break;
					case 'removed':
						dispatch(deleteRoom(room));
						break;
					default:
						break;
					}
				});

			} catch (error) {
				console.error(error);
				dispatch(setRooms([]));
			}
		});
	} catch (error) {
		console.error(error);

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return () => { };
	}
}

// TODO: this function is not used. Delete it?


export function listenToRoomsSettings(statementId: string): Unsubscribe {
	try {
		const roomSettingRef = doc(DB, Collections.roomsSettings, statementId);

		return onSnapshot(roomSettingRef, (doc) => {
			if (!doc.exists()) return;
			const roomSettings = doc.data() as RoomSettings;
			roomSettingsSchema.parse(roomSettings);
			
			store.dispatch(setRoomSettings(roomSettings));
		});
	} catch (error) {
		console.error(error);
		
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return () => { };
	}
}
