import { doc, getDoc } from "@firebase/firestore";
import { Collections, SetTimer } from "delib-npm";
import { DB } from "../config";
import { initialTimerArray } from "../../../view/pages/statement/components/rooms/admin/setTimers/SetTimersModal";


export async function getStatementTimers(statementId: string): Promise<SetTimer[]> {
    try {
        const timersRef = doc(DB, Collections.timers, statementId);
        const timersSnap = await getDoc(timersRef);
        const timers = timersSnap.data()?.timers;

        if (!timers) return initialTimerArray;
      
        return timers;
    } catch (error) {
        console.error(error);
        return initialTimerArray;
    }
}

// simple users
export async function listenToRoomTimers(statementId: string, roomNumber: number): Promise<SetTimer[]> {
    try {
        const timersRef = doc(DB, Collections.roomTimers, `${statementId}--${roomNumber}`);
        const timersSnap = await getDoc(timersRef);
        const timers = timersSnap.data()?.timers;

        if (!timers) return initialTimerArray;

        return timers.filter((timer: SetTimer) => timer.roomNumber === roomNumber);
    } catch (error) {
        console.error(error);
        return initialTimerArray;
    }
}

