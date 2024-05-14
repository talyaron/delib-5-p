import {
	Collections,
	Participant,
	Statement,
	StatementSchema,
	StatementType,
} from 'delib-npm';
import {
	and,
	collection,
	onSnapshot,
	or,
	query,
	where,
} from 'firebase/firestore';
import { DB } from '../config';
import { setRoomRequests } from '../../../model/rooms/roomsSlice';
import { Unsubscribe } from 'firebase/auth';
import { AppDispatch } from '../../../model/store';

export function listenToAllRoomsRequest(
	statement: Statement,
	dispatch: AppDispatch
): Unsubscribe {
	try {
		const requestRef = collection(DB, Collections.statementRoomsAsked);
		const q = query(requestRef, where('parentId', '==', statement.statementId));

		return onSnapshot(q, (requestsDB) => {
			try {
				const requests = requestsDB.docs.map(
					(requestDB) => requestDB.data() as Participant
				);

				dispatch(setRoomRequests(requests));
			} catch (error) {
				console.error(error);
				dispatch(setRoomRequests([]));
			}
		});
	} catch (error) {
		console.error(error);

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return () => {};
	}
}

// TODO: this function is not used. Delete it?
export function listenToRoomSolutions(
	statementId: string,
	cb: (rooms: Statement | null) => void
) {
	try {
		const statementSolutionsRef = collection(DB, Collections.statements);
		const q = query(
			statementSolutionsRef,
			and(
				where('parentId', '==', statementId),
				or(
					where('statementType', '==', StatementType.option),
					where('statementType', '==', StatementType.result)
				)
			)
		);

		return onSnapshot(q, (roomSolutionsDB) => {
			try {
				roomSolutionsDB.forEach((roomSolutionDB) => {
					try {
						const roomSolution = roomSolutionDB.data() as Statement;
						const { success } = StatementSchema.safeParse(roomSolution);

						if (!success)
							throw new Error(
								'roomSolution is not valid in listenToRoomSolutions()'
							);

						cb(roomSolution);
					} catch (error) {
						console.error(error);
					}
				});
			} catch (error) {
				console.error(error);
				cb(null);
			}
		});
	} catch (error) {
		console.error(error);
	}
}
