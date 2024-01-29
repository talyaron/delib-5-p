import { FC, useState } from "react";
import { t } from "i18next";
import styles from "./setTimers.module.scss";
import { SetTimer, Statement } from "delib-npm";
import {
    handleSetTimers,
    orderByStagesAndOrderFromTimers,
} from "./SetTimersCont";
import AdminTimerStage from "./timer/AdminTimerStage";

interface Props {
    parentStatement: Statement;
}

const SetTimers: FC<Props> = ({ parentStatement }) => {
    const [timers, setTimers] = useState<SetTimer[]>([
        { time: 0, name: "Discussion", order: 0, stage: "questions" },
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
                        stage={ts[0].stage}
                        timers={timers}
                        setTimers={setTimers}
                    />
                ))}
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
