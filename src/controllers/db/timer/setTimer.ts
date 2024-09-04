import {
	Timestamp,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { DB } from "../config";
import {
	Collections,
	RoomTimer,
	RoomTimerSchema,
	SetTimer,
	SetTimerSchema,
	Statement,
	TimerStatus,
	TimerStatusSchema,
} from "delib-npm";
import { z } from "zod";
import { store } from "@/model/store";
import { getRoomTimerId, getSetTimerId } from "../../general/helpers";

interface setParentTimersProps {
    parentStatement: Statement;
    userCanChangeTimer: boolean;
    timers: SetTimer[];
}

export async function updateTimersSettingDB(timers: SetTimer[]): Promise<void> {
	try {
		z.array(SetTimerSchema).parse(timers);

		timers.forEach(async (timer) => {
			const timerRef = doc(DB, Collections.timers, timer.timerId);
			await setDoc(timerRef, timer, { merge: true });
		});
	} catch (error) {
		console.error(error);
	}
}

export async function updateTimerSettingDB(timer: SetTimer): Promise<void> {
	try {
		const timerRef = doc(DB, Collections.timers, timer.timerId);
		await setDoc(timerRef, timer, { merge: true });
	} catch (error) {
		console.error(error);
	}
}

export async function deleteTimerSettingDB(timerId: string): Promise<boolean> {
	try {
		const timerRef = doc(DB, Collections.timers, timerId);
		await deleteDoc(timerRef);

		return true;
	} catch (error) {
		console.error(error);

		return false;
	}
}

export async function setParentTimersToDB({
	parentStatement,
	userCanChangeTimer,
	timers,
}: setParentTimersProps): Promise<{ success: boolean }> {
	try {
		const timersRef = doc(
			DB,
			Collections.timers,
			parentStatement.statementId,
		);
		z.array(SetTimerSchema).parse(timers);
		await setDoc(timersRef, {
			statement: parentStatement,
			userCanChangeTimer,
			timers,
		});

		return { success: true };
	} catch (error) {
		console.error(error);

		return { success: false };
	}
}

interface GetTimerProps {
    statementId: string;
    roomNumber: number;
    stage: string;
}
export function getTimerId({
	statementId,
	roomNumber,
	stage,
}: GetTimerProps): string | undefined {
	try {
		if (!statementId) throw new Error("Missing statementId");
		if (typeof roomNumber !== "number")
			throw new Error("Missing roomNumber");
		if (!stage) throw new Error("Missing stage");

		return `${statementId}--${roomNumber}--${stage}`;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}

export async function setTimersStatusDB(
	roomTimer: RoomTimer,
	newStatus: TimerStatus,
): Promise<void> {
	try {
		const userId = store.getState().user.user?.uid;
		if (!userId) throw new Error("Missing userId");
		RoomTimerSchema.parse(roomTimer);
		TimerStatusSchema.parse(newStatus);

		const timerRef = doc(
			DB,
			Collections.timersRooms,
			roomTimer.roomTimerId,
		);

		await setDoc(timerRef, { state: newStatus }, { merge: true });
	} catch (error) {
		console.error(error);
	}
}

interface setTimersInitTimeDBProps {
    statementId: string;
    roomNumber: number;
    timerId: string;
    initTime: number;
}

export async function setTimersInitTimeDB({
	statementId,
	roomNumber,
	timerId,
	initTime,
}: setTimersInitTimeDBProps): Promise<void> {
	try {
		const userId = store.getState().user.user?.uid;
		if (!userId) throw new Error("Missing userId");
		if (!statementId) throw new Error("Missing statementId");
		if (typeof roomNumber !== "number")
			throw new Error("Missing roomNumber");
		if (typeof timerId !== "number") throw new Error("Missing timer");

		const timerRef = doc(
			DB,
			Collections.timersRooms,
			`${statementId}--${roomNumber}`,
		);

		await setDoc(
			timerRef,
			{
				statementId,
				initiatorId: userId,
				roomNumber,
				timers: { [timerId]: { initTime } },
				updateTime: Timestamp.now(),
			},
			{ merge: true },
		);
	} catch (error) {
		console.error(error);
	}
}

interface InitializeTimersDBParams {
    statementId: string;
    rooms: Array<{ roomNumber: number }>;
}

export async function initializeTimersDB({
	statementId,
	rooms,
}: InitializeTimersDBParams): Promise<void> {
	try {
		//pre-checks
		const userId = store.getState().user.user?.uid;
		if (!userId) throw new Error("Missing userId");
		if (!statementId) throw new Error("Missing statementId");
		if (!rooms) throw new Error("Missing rooms");

		//get timers settings from DB
		const timersRef = collection(DB, Collections.timers);
		const q = query(timersRef, where("statementId", "==", statementId));
		const timersSettingsDB = await getDocs(q);

		if (timersSettingsDB.size === 0) {
			throw new Error("Timers settings not found");
		}

		const timersSettings = timersSettingsDB.docs.map(
			(doc) => doc.data() as SetTimer,
		);

		//initialize timers

		rooms.forEach((room) => {
			const roomNumber = room.roomNumber;
			const roomTimers: RoomTimer[] = timersSettings.map(
				(timerSetting) => {
					const roomTimer: RoomTimer = {
						statementId,
						roomNumber,
						time: timerSetting.time,
						order: timerSetting.order,
						state: TimerStatus.finish,
						lastUpdated: new Date().getTime(),
						title: timerSetting.title,
						roomTimerId: getRoomTimerId(
							statementId,
							roomNumber,
							timerSetting.order,
						),
						timerSettingId: getSetTimerId(
							statementId,
							timerSetting.order,
						),
					};

					return roomTimer;
				},
			);

			roomTimers.forEach(async (roomTimer) => {
				const timerRef = doc(
					DB,
					Collections.timersRooms,
					`${statementId}--${roomNumber}--${roomTimer.order}`,
				);

				await setDoc(timerRef, roomTimer, { merge: true });
			});
		});
	} catch (error) {
		console.error(error);
	}
}

export async function startNextTimer(roomTimer: RoomTimer): Promise<void> {
	try {
		const currentTimerOrder = roomTimer.order;
		const nextTimerOrder = currentTimerOrder + 1;
		const nextTimerRef = doc(
			DB,
			Collections.timersRooms,
			getRoomTimerId(
				roomTimer.statementId,
				roomTimer.roomNumber,
				nextTimerOrder,
			),
		);
		const nextTimer = await getDoc(nextTimerRef);
		if (nextTimer.exists()) {
			await setTimersStatusDB(
                nextTimer.data() as RoomTimer,
                TimerStatus.start,
			);
		}
	} catch (error) {
		console.error(error);
	}
}
