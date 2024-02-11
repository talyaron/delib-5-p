import { doc, getDoc, onSnapshot } from "@firebase/firestore";
import { Collections, RoomTimer, RoomTimerSchema, SetTimer } from "delib-npm";
import { DB } from "../config";
import { initialTimerArray } from "../../../view/pages/statement/components/rooms/admin/setTimers/SetTimersModal";
import { Unsubscribe } from "@firebase/util";

export async function getStatementTimers(
    statementId: string,
): Promise<SetTimer[]> {
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
export function listenToRoomTimers(
    statementId: string,
    roomNumber: number | undefined,
    setTimers: React.Dispatch<React.SetStateAction<RoomTimer | null>>,
): Unsubscribe {
    try {
        if (!roomNumber) throw new Error("Missing roomNumber");

        const timersRef = doc(
            DB,
            Collections.roomTimers,
            `${statementId}--${roomNumber}`,
        );

        return onSnapshot(timersRef, (timerDB) => {
            try {
                const timers = timerDB.data() as RoomTimer;

                const result = RoomTimerSchema.safeParse(timers);
                console.log(result.success);

                //@ts-ignore
                if (result.error) console.error(result.error);

                //    if(!success) {
                // setTimersInitTimeDB({statementId, roomNumber, timerId:1, initTime:90*1000})
                // setTimersInitTimeDB({statementId, roomNumber, timerId:1, initTime:90*1000})
                //    }
                setTimers(timers);
            } catch (error) {
                console.error(error);
                setTimers(null);
            }
        });
    } catch (error) {
        console.error(error);

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const unsub: Unsubscribe = () => {};

        return unsub;
    }
}
