import { doc, setDoc } from "firebase/firestore";
import { DB } from "../config";
import {
    Collections,
    SetTimer,
    SetTimerSchema,
    Statement,
} from "delib-npm";
import { z } from "zod";

interface setParentTimersProps {
    parentStatement: Statement;
    timers: SetTimer[];
}

export async function setParentTimersToDB({
    parentStatement,
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
            userCanChangeTimer: true,
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
