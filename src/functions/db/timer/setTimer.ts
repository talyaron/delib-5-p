import { Timestamp, doc, setDoc } from "firebase/firestore";
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
            Collections.roomTimers,
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
            Collections.roomTimers,
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

interface setTimersInitTimeDBProps {
    statementId: string;
    roomNumber: number;
    timerId1: number;
    initTime1: number;
    timerId2: number;
    initTime2:number;
}

export async function initilizeTimersDB({
    statementId,
    roomNumber,
    timerId1,
    timerId2,
    initTime1,
    initTime2,
}: setTimersInitTimeDBProps): Promise<void> {
    try {
        const userId = store.getState().user.user?.uid;
        if (!userId) throw new Error("Missing userId");
        if (!statementId) throw new Error("Missing statementId");
        if (typeof roomNumber !== "number")
            throw new Error("Missing roomNumber");
        if (typeof timerId1 !== "number") throw new Error("Missing timerId 1");
        if (typeof timerId2 !== "number") throw new Error("Missing timerId 2");
        if (typeof initTime1 !== "number") throw new Error("Missing init time 1");
        if (typeof initTime2 !== "number") throw new Error("Missing init time 2");

        const timerRef = doc(
            DB,
            Collections.roomTimers,
            `${statementId}--${roomNumber}`,
        );

        await setDoc(
            timerRef,
            {
                statementId,
                initiatorId: userId,
                roomNumber,
                timers: { [timerId1]: { initTime1 }, },
                updateTime: Timestamp.now(),
            },
            { merge: true },
        );
    } catch (error) {
        console.error(error);
    }
}