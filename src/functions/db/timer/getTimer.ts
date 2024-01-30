import { doc, getDoc, onSnapshot } from "@firebase/firestore";
import { Collections, RoomTimer, RoomTimerSchema, SetTimer } from "delib-npm";
import { DB } from "../config";
import { initialTimerArray } from "../../../view/pages/statement/components/rooms/admin/setTimers/SetTimersModal";
import { Unsubscribe } from "@firebase/util";



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
export function listenToRoomTimers(statementId: string, roomNumber: number|undefined, setTimers: Function): Unsubscribe {
    try {
        if(!roomNumber) throw new Error("Missing roomNumber");

        const timersRef = doc(DB, Collections.roomTimers, `${statementId}--${roomNumber}`);
        return onSnapshot(timersRef, (timerDB) => {
            try {
                const timers = timerDB.data() as RoomTimer;
                RoomTimerSchema.parse(timers);
                setTimers(timers)
         
            } catch (error) {
                console.error(error);
                setTimers(null)
            }
            
        });
    } catch (error) {
        console.error(error);
        return ()=>{}  ;
    }
}

