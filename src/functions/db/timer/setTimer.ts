import {  doc, serverTimestamp, setDoc } from "firebase/firestore";
import { DB } from "../config";
import { Collections, Timer, } from "delib-npm";
import { store } from "../../../model/store";



export async function startTimerDB({
    parentId,
    statementId,
    roomNumber,
    stage,
    timeToCount,
    timerStatus
}: Timer) {
    try {
        const creatorId = store.getState().user.user?.uid;
        if(!creatorId) throw new Error("Missing creatorId");

        const timerId = getTimerId({ statementId, roomNumber, stage });
        if(!timerId) throw new Error("Missing timerId");
        const timerRef = doc(DB, Collections.timers, timerId);
       
        //@ts-ignore
        await setDoc(timerRef, {
            parentId,
            statementId,
            roomNumber,
            stage,
            creatorId,
             //@ts-ignore
            startTime:serverTimestamp().toMillis(),
            timeToCount: timeToCount||(1000*90),           
            timerStatus
        });
        return
    } catch (error) {
        console.error(error);
        return
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
        if (!statementId || !roomNumber || !stage)
            throw new Error("Missing statementId, roomNumber or stage");
        return `${statementId}--${roomNumber}--${stage}`;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
