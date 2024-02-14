import { FC, useState } from "react";
import styles from "./Timers.module.scss";
import { RoomTimer, Statement } from "delib-npm";
import Timer from "./RoomTimer";


interface Props {
    statement: Statement;
    roomNumber: number | undefined;
    timers: RoomTimer[];
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
            {timers.map((timer, index) => (
            <Timer
                statement={statement}
                timerId={index}
                title="הצגה"
                activeTimer={activeTimer === 1 ? true : false}
                nextTimer={nextTimer}
                roomNumber={roomNumber}
                timer={timer}
            />
            ))}
           
        </div>
    );
};

export default Timers;
