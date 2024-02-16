import { FC, useState } from "react";
import styles from "./Timers.module.scss";
import { RoomTimer, Statement, TimerStatus } from "delib-npm";
import RoomTimerComp from "./RoomTimer";
import { t } from "i18next";

interface Props {
    roomNumber: number | undefined;
    timers: RoomTimer[];
}

const RoomTimers: FC<Props> = ({ roomNumber, timers }) => {
    try {
        if (!roomNumber) return null;

        const [activeTimer, setActiveTimer] = useState<RoomTimer>(
            getActiveTimer(timers),
        );

        console.log(activeTimer, "activeTimer");

        return (
            <div className={styles.timers}>
                {timers.map((timer) => (
                    <RoomTimerComp
                        key={timer.roomTimerId}
                        roomTimer={timer}
                        isActiveTimer={
                            timer.roomTimerId === activeTimer.roomTimerId
                        }
                        // nextTimer={nextTimer}
                    />
                ))}
            </div>
        );
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default RoomTimers;

function getActiveTimer(timers: RoomTimer[]): RoomTimer {
    const _timers = [...timers];
    try {
      
      
        //find first timer by order that has not finished
        const activeTimer = _timers
            .sort((a, b) => a.order - b.order)
            .find((timer) => timer.state !== TimerStatus.finish) as RoomTimer;

        if (activeTimer === undefined) {
            return _timers.sort((a, b) => a.order - b.order)[0];
        }
        throw new Error("No active timer found");
    } catch (error) {
        console.error(error);
        return _timers.sort((a, b) => a.order - b.order)[0];
    }
}
