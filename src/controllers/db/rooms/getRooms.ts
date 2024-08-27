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
import {  setRooms } from '@/model/rooms/roomsSlice';
import { Unsubscribe } from 'firebase/auth';
import { store } from '@/model/store';


export function listenToRooms(
	statement: Statement,
): Unsubscribe {
	try {
		const dispatch = store.dispatch;
		const requestRef = collection(DB, Collections.rooms);
		const q = query(requestRef, where('parentId', '==', statement.statementId));

		return onSnapshot(q, (roomsDB) => {
			try {
				const rooms = roomsDB.docs.map(
					(requestDB) => requestDB.data() as ParticipantInRoom
				);

				dispatch(setRooms(rooms));
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

