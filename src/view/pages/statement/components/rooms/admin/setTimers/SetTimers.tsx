import { FC, useEffect } from "react";
import { t } from "i18next";
import styles from "./setTimers.module.scss";
import { SetTimer, Statement } from "delib-npm";

import { getSetTimersDB } from "../../../../../../../functions/db/timer/getTimer";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../../../functions/hooks/reduxHooks";
import { selectStatementSettingTimers, setSetTimer } from "../../../../../../../model/timers/timersSlice";
import SetSetTimerComp from "./setTimer/SetSetTimerComp";
import {
    updateTimerSettingDB
} from "../../../../../../../functions/db/timer/setTimer";
import { getSetTimerId } from "../../../../../../../functions/general/helpers";

interface Props {
    parentStatement: Statement;
}

const SetTimers: FC<Props> = ({ parentStatement }) => {
    try {
        if (!parentStatement) throw new Error("parentStatement is required");

        const dispatch = useAppDispatch();

        const timers:SetTimer[] = useAppSelector(
            selectStatementSettingTimers(parentStatement.statementId),
        ).sort((a, b) => a.order - b.order);

        //get timers from DB
        useEffect(() => {
            getSetTimersDB(parentStatement.statementId, dispatch);
        }, []);

        return (
            <section>
                <h2>{t("Setting Timers")}</h2>
                <p>{t("You can set the timers for each stage here.")}</p>
                <div className={styles.timers}>
                    {timers.map((timer, i) => (
                        <SetSetTimerComp
                            key={timer.order}
                            setTimer={timer}
                            index={i}
                        />
                    ))}
                </div>
                <button
                    className="btn btn--add"
                    onClick={() => {
                        const newTimer = {
                            statementId: parentStatement.statementId,
                            time: 1000 * 90,
                            title: "Discussion",
                            order: timers.length,
                            timerId: getSetTimerId(
                                parentStatement.statementId,
                                timers.length,
                            ),
                        };
                        dispatch(setSetTimer(newTimer));
                        updateTimerSettingDB(newTimer);
                    }}
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
