import { FC, useState } from "react";
import { t } from "i18next";
import styles from "./setTimers.module.scss";
import { SetTimer, Statement } from "delib-npm";
import {
    handleAddStage,
    handleSetTimers,
    orderByStagesAndOrderFromTimers,
} from "./SetTimersCont";
import AdminTimerStage from "./timer/AdminTimerStage";
import { uuidv4 } from "@firebase/util";

interface Props {
    parentStatement: Statement;
}

const SetTimers: FC<Props> = ({ parentStatement }) => {
    const [timers, setTimers] = useState<SetTimer[]>([
        { time: 0, name: "Discussion", order: 0, stageName: "questions", stageId:uuidv4(), timerId:uuidv4() },
    ]);
    const orderdTimers = orderByStagesAndOrderFromTimers(timers);
    return (
        <section>
            <h2>{t("Setting Timers")}</h2>
            <p>{t("You can set the timers for each stage here.")}</p>
            <div className={styles.timers}>
                {orderdTimers.map((ts, i) => (
                    <AdminTimerStage
                        key={`timer-stage-${i}`}
                        stageName={ts[0].stageName}
                        stageId={ts[0].stageId}
                        timers={timers}
                        setTimers={setTimers}
                    />
                ))}
                <div className="btn btn--add" onClick={()=>handleAddStage(timers,setTimers)}>ADD Stage</div>
            </div>
            <div>
                <div className="btns">
                    <div
                        className="btn btn--add btn--large"
                        onClick={() =>
                            handleSetTimers({ parentStatement, timers })
                        }
                    >
                        Set for All Rooms
                    </div>
                </div>
            </div>
        </section>
    );
};



export default SetTimers;
