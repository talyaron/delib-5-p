import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { DB } from "../config";
import { Collections, Stage, Statement, Timer, TimerStatus } from "delib-npm";
import { store } from "../../../model/store";

interface StartTimerProps {
    statement: Statement;
    roomNumber: number;
    stage: Stage;
    timeToCount: number;
    timerStatus: TimerStatus;
}

export async function startTimerDB({
    statement,
    roomNumber,
    stage,
    timeToCount,
    timerStatus,
}: StartTimerProps) {
    try {
        const creatorId = store.getState().user.user?.uid;
        if (!creatorId) throw new Error("Missing creatorId");

        const timerId = getTimerId({
            statementId: statement.statementId,
            roomNumber,
            stage,
        });
        if (!timerId) throw new Error("Missing timerId");
        const timerRef = doc(DB, Collections.timers, timerId);

        const r = await fetch(
            "http://worldtimeapi.org/api/timezone/Asia/Jerusalem",
        );
        let { unixtime } = await r.json();
        if(!unixtime) unixtime = new Date().getTime();

        //@ts-ignore
        await setDoc(timerRef, {
            parentId: statement.parentId,
            statementId: statement.statementId,
            roomNumber: roomNumber || 0,
            stage: stage || "parent-statement",
            creatorId,
            startTime: unixtime,
            timeToCount: timeToCount || 1000 * 90,
            timerStatus,
        });
        return;
    } catch (error) {
        console.error(error);
        return;
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
