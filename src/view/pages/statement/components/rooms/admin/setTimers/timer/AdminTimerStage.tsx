import { FC } from "react";
import styles from "../setTimers.module.scss";
import AdminTimer from "./AdminTimer";
import { SetTimer } from "delib-npm";
import { t } from "i18next";

interface Props {
    stage: string;
    timers: SetTimer[];
    setTimers: Function;
}

const AdminTimerStage: FC<Props> = ({ stage, timers:allTimers, setTimers }) => {
    const timers = allTimers.filter((t) => t.stage === stage);
    return (

        <div className={styles.timerStage}>
            <label>{t("Stage Name")}</label>
            <input type="text" placeholder="Stage name" defaultValue={stage} />
            {timers.map((t, i) => (
                <AdminTimer
                    key={`timer-setting-${i}`}
                    time={t.time}
                    name={t.name}
                    index={i}
                    setTimers={setTimers}
                    timers={timers}
                    stage={stage}
                />
            ))}
        </div>
    );
};

export default AdminTimerStage;
