import {FC, useState} from 'react';
import styles from './Timers.module.scss';
import { Statement } from 'delib-npm';
import Timer from './Timer';

interface Props {
    statement: Statement;
}

const Timers:FC<Props> = ({statement}) => {
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
        <Timer statement={statement} title="Timer 1" activeTimer={activeTimer=== 1?true:false} nextTimer={nextTimer} initTime={3*1000} />
        <Timer statement={statement} title="Timer 2" activeTimer={activeTimer=== 2?true:false} nextTimer={nextTimer} initTime={5*1000} autoStart={true}/>
    </div>
  )
}

export default Timers