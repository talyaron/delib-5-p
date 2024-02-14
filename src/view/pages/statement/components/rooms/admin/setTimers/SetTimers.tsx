import { FC, useState, useEffect } from "react";
import { t } from "i18next";
import styles from "./setTimers.module.scss";
import { SetTimer, Statement } from "delib-npm";
import { handleSetTimers } from "./SetTimersCont";
import { initialTimerArray } from "./SetTimersModal";
import { getSetTimersDB } from "../../../../../../../functions/db/timer/getTimer";

import { useAppDispatch, useAppSelector } from "../../../../../../../functions/hooks/reduxHooks";
import { selectStatementSettingTimers, selectTimersSetting, setSetTimer } from "../../../../../../../model/timers/timersSlice";
import SetTimerComp from "./setTimer/SetTimerComp";

interface Props {
    parentStatement: Statement;
}

const SetTimers: FC<Props> = ({ parentStatement }) => {
    try {
        if (!parentStatement) throw new Error("parentStatement is required");

        const dispatch = useAppDispatch();

        const timers = useAppSelector(selectStatementSettingTimers(parentStatement.statementId)).sort((a, b) => a.order - b.order);

        //get timers from DB
        useEffect(() => {
            getSetTimersDB(parentStatement.statementId, dispatch);
        }, []);

        return (
            <section>
                <h2>{t("Setting Timers")}</h2>
                <p>{t("You can set the timers for each stage here.")}</p>
                <div className={styles.timers}>
                    {timers.map((timer) => (<SetTimerComp key={timer.order} timer={timer} />
                      
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
