import {
    Timestamp,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { DB } from "../config";
import {
    Collections,
    RoomDivied,
    RoomDiviedSchema,
    RoomTimer,
    SetTimer,
    SetTimerSchema,
    Statement,
    TimerStatus,
} from "delib-npm";
import { z } from "zod";
import { store } from "../../../model/store";

interface setParentTimersProps {
    parentStatement: Statement;
    userCanChangeTimer: boolean;
    timers: SetTimer[];
}

export async function updateTimerSettingDB({
    statementId,
    time,
    title,
    order,
    timerId,
}: {
    statementId: string;
    time: number;
    title: string;
    order: number;
    timerId: string;
}): Promise<void> {
    try {
        console.log(statementId, time, title, order, timerId)
        const timerRef = doc(DB, Collections.timers, timerId);

        const timerSetting: SetTimer = {
            timerId,
            statementId,
            time,
            title,
            order,
        };

        SetTimerSchema.parse(timerSetting);

        await setDoc(timerRef, timerSetting, { merge: true });
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
}: setParentTimersProps): Promise<{ success: boolean; error?: string }> {
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
    } catch (error: any) {
        console.error(error);

        return { success: false, error: error.message };
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

interface SetTimersStateProps {
    statementId: string;
    roomNumber: number;
    timerId: number;
    state: TimerStatus;
}

export async function setTimersStateDB({
    statementId,
    roomNumber,
    timerId,
    state,
}: SetTimersStateProps): Promise<void> {
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
                activeTimer: timerId,
                state,
                updateTime: Timestamp.now(),
            },
            { merge: true },
        );
    } catch (error) {
        console.error(error);
    }
}

interface setTimersInitTimeDBProps {
    statementId: string;
    roomNumber: number;
    timerId: number;
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

interface InitilizeTimersDBProps {
    statementId: string;
    rooms: RoomDivied[];
}

export async function initilizeTimersDB({
    statementId,
    rooms,
}: InitilizeTimersDBProps): Promise<void> {
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

        //initilize timers

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
