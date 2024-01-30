import { FC, useState } from "react";
import styles from "./Timers.module.scss";
import { RoomTimer, Statement } from "delib-npm";
import Timer from "./Timer";


interface Props {
    statement: Statement;
    roomNumber: number | undefined;
    timers: RoomTimer | null;
}

const Timers: FC<Props> = ({ statement, roomNumber, timers }) => {
    if (!roomNumber) return null;

    const [activeTimer, setActiveTimer] = useState<number>(1);

    function nextTimer() {
        if (activeTimer === 1) {
            setActiveTimer(2);
        } else {
            setActiveTimer(1);
        }
    }
    return (
        <div className={styles.timers}>
            <Timer
                statement={statement}
                timerId={1}
                title="הצגה"
                activeTimer={activeTimer === 1 ? true : false}
                nextTimer={nextTimer}
                roomNumber={roomNumber}
                timers={timers}
            />
            <Timer
                statement={statement}
                timerId={2}
                title="שאלות ותשובות"
                activeTimer={activeTimer === 2 ? true : false}
                nextTimer={nextTimer}
                roomNumber={roomNumber}
                autoStart={true}
                lastTimer={true}
                timers={timers}
            />
        </div>
    );
};

export default Timers;
