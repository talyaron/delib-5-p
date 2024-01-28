import {FC, useState } from "react";
import { t } from "i18next";
import styles from "./setTimers.module.scss";
import { SetTimer, Statement } from "delib-npm";
import Timer from "./timer/Timer";
import { handleSetTimers } from "./SetTimersCont";

interface Props {
    parentStatement: Statement;
}

const SetTimers:FC<Props> = ({parentStatement}) => {
    const [timers, setTimers] = useState<SetTimer[]>([{ time: 0, name: "Discussion", order: 0}]);
    return (
        <section>
            <h2>{t("Setting Timers")}</h2>
            <p>{t("You can set the timers for each stage here.")}</p>
            <div className={styles.timers}>
            {timers.map((t,i)=><Timer key={`timer-setting-${i}`} time={t.time} name={t.name} index={i} setTimers={setTimers} timers={timers} />)}
            </div>
            <div>
            <div className="btns">
                <div className="btn btn--add btn--large" onClick={()=>handleSetTimers({parentStatement, timers})}>Set for All Rooms</div>
            </div>
            </div>
        </section>
    );
};

export default SetTimers;





