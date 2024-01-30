import { Timestamp, doc, setDoc } from "firebase/firestore";
import { DB } from "../config";
import { Collections, SetTimer, SetTimerSchema, Statement, TimerStatus } from "delib-npm";
import { z } from "zod";

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
    state:TimerStatus;
    initTime?: number;

}

export async function setTimersStateDB({
    statementId,
    roomNumber,
    timerId,
    state,
    initTime,
}: SetTimersStateProps): Promise<void> {
    try {
        if (!statementId) throw new Error("Missing statementId");
        if (typeof roomNumber !== "number")
            throw new Error("Missing roomNumber");
        if (typeof timerId !== "number") throw new Error("Missing timer");

        const timerRef = doc(
            DB,
            Collections.roomTimers,
            `${statementId}--${roomNumber}`,
        );

        if (initTime)
            await setDoc(
                timerRef,
                {
                    statementId,
                    roomNumber,
                    [timerId]: { initTime },
                    activeTimer: timerId,
                    state,
                    updateTime: Timestamp.now(),
                },
                { merge: true },
            );
        else
            await setDoc(
                timerRef,
                {
                    statementId,
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
