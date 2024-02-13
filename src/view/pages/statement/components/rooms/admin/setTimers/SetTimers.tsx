import { FC, useState, useEffect } from "react";
import { t } from "i18next";
import styles from "./setTimers.module.scss";
import { SetTimer, Statement } from "delib-npm";
import { handleSetTimers } from "./SetTimersCont";
import { initialTimerArray } from "./SetTimersModal";
import { getStatementTimersDB } from "../../../../../../../functions/db/timer/getTimer";
import AdminTimer from "./timer/AdminTimer";

interface Props {
    parentStatement: Statement;
}

const SetTimers: FC<Props> = ({ parentStatement }) => {
    try {
        if (!parentStatement) throw new Error("parentStatement is required");

        const [timers, setTimers] = useState<SetTimer[]>(
            initialTimerArray.sort((a, b) => a.order - b.order),
        );

      

        useEffect(() => {
            getStatementTimersDB(parentStatement.statementId).then((timersDB) => {

                setTimers(timersDB.sort((a, b) => a.order - b.order));
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
                        />
                    ))}
                </div>
                <button
                    className="btn btn--add"
                    onClick={() =>
                        handleSetTimers({ parentStatement, timers, setTimers })
                    }
                >
                    Add Timer
                </button>
            </section>
        );
    } catch (error) {
        console.error(error);
        return <div>{t("Error")}</div>;
    }
};

export default SetTimers;
