import {FC, useState} from 'react';
import styles from './Timers.module.scss';
import { Statement } from 'delib-npm';
import Timer from './Timer';

interface Props {
    statement: Statement;
    roomNumber: number|undefined;
}

const Timers:FC<Props> = ({statement,roomNumber}) => {
    if(!roomNumber) return null;
    const [activeTimer, setActiveTimer] = useState<1|2>(1);


    function nextTimer() {
        if(activeTimer === 1) {
            setActiveTimer(2);
        } else {
            setActiveTimer(1);
        }
    }
  return (
    <div className={styles.timers}>
        <Timer statement={statement} timerId={1} title="הצגה" activeTimer={activeTimer=== 1?true:false} nextTimer={nextTimer} initTime={2*1000} roomNumber={roomNumber} />
        <Timer statement={statement} timerId={2} title="שאלות ותשובות" activeTimer={activeTimer=== 2?true:false} nextTimer={nextTimer} initTime={3*1000}  roomNumber={roomNumber} autoStart={true} lastTimer={true}/>
    </div>
  )
}

export default Timers