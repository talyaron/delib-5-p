import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { DB } from "../config";
import {
    Collections,
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

export async function updateTimersDB({statementId, timerId, time, name, order}: {statementId:string, timerId: string, time: number, name: string, order:number}): Promise<void> {
    try {
        const timerRef = doc(DB, Collections.timers, `${statementId}--${timerId}`);
       
        await setDoc(timerRef, {
            timerId:`${statementId}--${timerId}`,
            statementId,
            time,
            name,
            order
        }, {merge: true})
    } catch (error) {
        console.error(error);
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
    roomNumber: number;

}

export async function initilizeTimersDB({
    statementId,
    roomNumber,

}: InitilizeTimersDBProps): Promise<void> {
    try {

        //pre-checks
        const userId = store.getState().user.user?.uid;
        if (!userId) throw new Error("Missing userId");
        if (!statementId) throw new Error("Missing statementId");
        if (typeof roomNumber !== "number")
            throw new Error("Missing roomNumber");
   

        const timerRef = doc(
            DB,
            Collections.timersRooms,
            `${statementId}--${roomNumber}`,
        );


        //prevent from creating new timers if they already exist
        const timersDB = await getDoc(timerRef);
        if (timersDB.exists()) return;

        //initilize timers
        await setDoc(
            timerRef,
            {
                statementId,
                initiatorId: userId,
                roomNumber,
                timers:{
                    1: { initTime: 60 * 1000 },
                    2: { initTime: 60 * 1000 }
                },
                activeTimer: 1,
                updateTime: Timestamp.now(),
                state: TimerStatus.finish,
                lastUpdated:new Date().getTime()
            },
            { merge: true },
        );
    } catch (error) {
        console.error(error);
    }
}