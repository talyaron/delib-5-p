import { FC } from "react";
import styles from "./Timers.module.scss";
import { RoomTimer, TimerStatus } from "delib-npm";
import RoomTimerComp from "./RoomTimer";


interface Props {
    roomNumber: number | undefined;
    timers: RoomTimer[];
}

const RoomTimers: FC<Props> = ({ roomNumber, timers }) => {
    try {
        if (!roomNumber) return null;

        const activeTimer: RoomTimer | undefined = getActiveTimer(timers);
        if (!activeTimer) return null;

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

function getActiveTimer(timers: RoomTimer[]): RoomTimer | undefined {
    const _timers = [...timers];
    try {
        if (_timers.length === 0) return undefined;

        //find first timer by order that has not finished
        const activeTimer = _timers
            .sort((a, b) => a.order - b.order)
            .find((timer) => timer.state !== TimerStatus.finish) as RoomTimer;

        if (activeTimer === undefined) {
            return _timers.sort((a, b) => a.order - b.order)[0];
        }
        return activeTimer;
    } catch (error) {
        console.error(error);
        return _timers.sort((a, b) => a.order - b.order)[0];
    }
}
