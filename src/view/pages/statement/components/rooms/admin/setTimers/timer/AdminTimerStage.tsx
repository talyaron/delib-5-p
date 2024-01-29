import { FC } from "react";
import styles from "../setTimers.module.scss";
import AdminTimer from "./AdminTimer";
import { SetTimer } from "delib-npm";
import { t } from "i18next";
import { uuidv4 } from "@firebase/util";


interface Props {
    stageId: string;
    stageName: string;
    timers: SetTimer[];
    setTimers: Function;
}

const AdminTimerStage: FC<Props> = ({
    stageId,
    stageName,
    timers: allTimers,
    setTimers,
}) => {
    const timers = allTimers.filter((t) => t.stageId === stageId);
    return (
        <div className={styles.timerStage}>
            <label>{t("Stage Name")}</label>
            <input type="text" placeholder="Stage name" defaultValue={stageName} />
            {timers.map((t, i) => (
                <AdminTimer key={t.timerId} timer={t} index={i} timers={timers} setTimers={setTimers} />
            ))}
            <div className="btn btn--add" onClick={handleAddTimer}>
                ADD TIMER
            </div>
        </div>
    );

    function handleAddTimer() {
        try {
            const _timers = [...timers];
            const maxOrder = Math.max(..._timers.map((t) => t.order));
            const newTimer:SetTimer = {
                time: 90 * 1000,
                name: "start",
                order: maxOrder + 1,
                stageName: stageName,
                stageId: stageId,
                timerId: uuidv4(),
            };

            setTimers([...allTimers, newTimer]);
        } catch (error) {
            console.error(error);
        }
    }
};

export default AdminTimerStage;
