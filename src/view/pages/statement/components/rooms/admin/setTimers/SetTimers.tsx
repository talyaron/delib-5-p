import { FC, useState, useEffect } from "react";
import { t } from "i18next";
import styles from "./setTimers.module.scss";
import { SetTimer, Statement } from "delib-npm";
import { handleSetTimers } from "./SetTimersCont";
import { initialTimerArray } from "./SetTimersModal";
import { getStatementTimers } from "../../../../../../../functions/db/timer/getTimer";
import AdminTimer from "./timer/AdminTimer";

interface Props {
    parentStatement: Statement;
}

const SetTimers: FC<Props> = ({ parentStatement }) => {
    try {

        if(!parentStatement) throw new Error("parentStatement is required");
        
        const [timers, setTimers] = useState<SetTimer[]>(
            initialTimerArray.sort((a, b) => a.order - b.order),
        );
    
        const [timersChanged, setTimersChanged] = useState<boolean>(false);
    
        useEffect(() => {
            getStatementTimers(parentStatement.statementId).then((timers) => {
                console.log(timers);
    
                setTimers(timers.sort((a, b) => a.order - b.order));
            });
        }, []);
    
        return (
            <section>
                <h2>{t("Setting Timers")}</h2>
                <p>{t("You can set the timers for each stage here.")}</p>
                <div className={styles.timers}>
                    {timers.map((t, i) => (
                        <AdminTimer
                            statementId={parentStatement.statementId}
                            key={`timeer-key-${t.timerId}`}
                            timer={t}
                            index={i}
                            timers={timers}
                            setTimers={setTimers}
                            setTimersChanged={setTimersChanged}
                        />
                    ))}
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
    } catch (error) {
        console.error(error);
        return <div>{t("Error")}</div>;
    }
};

export default SetTimers;
