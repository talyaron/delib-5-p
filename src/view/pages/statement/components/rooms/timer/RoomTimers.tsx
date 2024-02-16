import { FC, useState } from "react";
import styles from "./Timers.module.scss";
import { RoomTimer, Statement, TimerStatus } from "delib-npm";
import RoomTimerComp from "./RoomTimer";

interface Props {
    roomNumber: number | undefined;
    timers: RoomTimer[];
}

const RoomTimers: FC<Props> = ({ roomNumber, timers }) => {
    if (!roomNumber) return null;

    const [activeTimer, setActiveTimer] = useState<RoomTimer|undefined>(getActiveTimer(timers, roomNumber));
    const [isMaster, setIsMaster] = useState<boolean>(false);
    const allTimersFinshed:boolean = timers.every(timer => timer.state === TimerStatus.finish);

    function nextTimer(currentTimer:RoomTimer):RoomTimer|undefined {
        try {
            //find next timer
            const correntOrder = currentTimer.order;
            const nextTimer = timers.sort((a, b)=>a.order = b.order).find(timer => timer.order >correntOrder);
            setActiveTimer(nextTimer);
            return nextTimer;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    return (
        <div className={styles.timers}>
            {timers.map((timer) => (
                <RoomTimerComp
                    key={timer.roomTimerId}
                    roomTimer={timer}
                    allTimersFinshed={allTimersFinshed}
                    nextTimer={nextTimer}
                />
            ))}
        </div>
    );
};

export default RoomTimers;

function getActiveTimer(timers: RoomTimer[], roomNumber: number):RoomTimer | undefined {
    return timers.find(timer => timer.roomNumber === roomNumber && timer.state === TimerStatus.start);
}