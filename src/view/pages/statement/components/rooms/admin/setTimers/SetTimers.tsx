import { FC, useState, useEffect } from "react";
import {  t, use } from "i18next";
import styles from "./setTimers.module.scss";
import { SetTimer, Statement } from "delib-npm";
import {
    handleAddStage,
    handleSetTimers,
    orderByStagesAndOrderFromTimers,
} from "./SetTimersCont";
import AdminTimerStage from "./timer/AdminTimerStage";
import { initialTimerArray } from "./SetTimersModal";
import { getStatementTimers } from "../../../../../../../functions/db/timer/getTimer";

interface Props {
    parentStatement: Statement;
}

const SetTimers: FC<Props> = ({ parentStatement }) => {
    const [timers, setTimers] = useState<SetTimer[]>(initialTimerArray);

    const [timersChanged, setTimersChanged] = useState<boolean>(false);
    const orderdTimers = orderByStagesAndOrderFromTimers(timers);

useEffect(() => {
    getStatementTimers(parentStatement.statementId).then((timers) => {
        setTimers(timers);
    });
}, []);

    return (
        <section>
            <h2>{t("Setting Timers")}</h2>
            <p>{t("You can set the timers for each stage here.")}</p>
            <div className={styles.timers}>
                {orderdTimers.map((ts, i) => (
                    <AdminTimerStage
                        key={`timer-stage-${i}`}
                        stageId={ts[0].stageId}
                        timers={timers}
                        setTimers={setTimers}
                        setTimersChanged={setTimersChanged}
                    />
                ))}
                <div
                    className="btn btn--add"
                    onClick={() => handleAddStage(timers, setTimers)}
                >
                    ADD Stage
                </div>
            </div>
            <div>
                <div className="btns">
                    <div
                        className={
                            timersChanged
                                ? "btn btn--add btn--large"
                                : "btn btn--add btn--large btn--inactive"
                        }
                        onClick={() => {
                            if (timersChanged)
                                handleSetTimers({
                                    parentStatement,
                                    timers,
                                    setTimersChanged,
                                });
                        }}
                    >
                        Set for All Rooms
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SetTimers;
