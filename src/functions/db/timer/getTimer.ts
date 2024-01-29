import { doc, getDoc } from "@firebase/firestore";
import { Collections, SetTimer } from "delib-npm";
import { DB } from "../config";
import { initialTimerArray } from "../../../view/pages/statement/components/rooms/admin/setTimers/SetTimersModal";


export async function getStatmentTimers(statementId: string): Promise<SetTimer[]> {
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