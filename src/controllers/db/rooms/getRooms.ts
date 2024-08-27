import {
	Collections,
	ParticipantInRoom,
	Statement
} from 'delib-npm';
import {
	collection,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { DB } from '../config';
import {  deleteRoom, setRoom, setRooms } from '@/model/rooms/roomsSlice';
import { Unsubscribe } from 'firebase/auth';
import { store } from '@/model/store';


export function listenToRooms(
	statement: Statement,
): Unsubscribe {
	try {
		const dispatch = store.dispatch;
		const requestRef = collection(DB, Collections.rooms);
		const q = query(requestRef, where('statement.parentId', '==', statement.statementId));

		return onSnapshot(q, (roomsDB) => {
			try {
				roomsDB.docChanges().forEach((change) => {

					const room = change.doc.data() as ParticipantInRoom;

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
		return () => {};
	}
}

// TODO: this function is not used. Delete it?

