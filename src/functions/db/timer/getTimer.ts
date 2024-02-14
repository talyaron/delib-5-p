import {
    collection,
    getDocs,
    onSnapshot,
    where,
    query,
} from "@firebase/firestore";
import { Collections, RoomTimer, RoomTimerSchema, SetTimer } from "delib-npm";
import { DB } from "../config";
import { initialTimerArray } from "../../../view/pages/statement/components/rooms/admin/setTimers/SetTimersModal";
import { Unsubscribe } from "@firebase/util";
import { updateTimerSettingDB } from "./setTimer";
import { z } from "zod";

export async function getStatementTimersDB(
    statementId: string,
): Promise<SetTimer[]> {
    try {
        const timersRef = collection(DB, Collections.timers);
        const q = query(timersRef, where("statementId", "==", statementId));
        const timersDB = await getDocs(q);

        if (timersDB.size === 0) {
            initialTimerArray.forEach(async (timer) => {
                updateTimerSettingDB({
                    statementId,
                    time: timer.time,
                    title: timer.title,
                    order: timer.order,
                });
            });
            return initialTimerArray;
        }

        const timers: SetTimer[] = timersDB.docs.map(
            (doc) => doc.data() as SetTimer,
        );

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
    setTimers: React.Dispatch<React.SetStateAction<RoomTimer[]>>,
): Unsubscribe {
    try {
        console.log(roomNumber)
        if (!roomNumber) throw new Error("Missing roomNumber");

        const timersRef = collection(DB, Collections.timersRooms);
        const q = query(timersRef, where("statementId", "==", statementId), where("roomNumber", "==", roomNumber));

        return onSnapshot(q, (roomTimersDB) => {
            try {
                const timers:RoomTimer[] = roomTimersDB.docs.map(roomTimer=>roomTimer.data() as RoomTimer);
 console.log('timers', timers)

              z.array(RoomTimerSchema).parse(timers);
                
                setTimers(timers);
            } catch (error) {
                console.error(error);
                setTimers([]);
            }
        });
    } catch (error) {
        console.error(error);

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const unsub: Unsubscribe = () => {};

        return unsub;
    }
}
