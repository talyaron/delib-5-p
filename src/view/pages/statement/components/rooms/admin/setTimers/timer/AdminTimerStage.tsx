import React, { FC, useEffect, useState } from "react";
import styles from "../setTimers.module.scss";
import AdminTimer from "./AdminTimer";
import { SetTimer } from "delib-npm";
import { t } from "i18next";
import { uuidv4 } from "@firebase/util";

interface Props {
    stageId: string;
   
    timers: SetTimer[];
    setTimers: React.Dispatch<React.SetStateAction<SetTimer[]>>;
    setTimersChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminTimerStage: FC<Props> = ({
    stageId,
   
    timers,
    setTimers,
    setTimersChanged,
}) => {

    const stageTimers = timers.filter((t) => t.stageId === stageId);
    const stageName = stageTimers[0].stageName;

    const [_stageName, setStageName] = useState<string>(stageName);

    useEffect(() => {
        setStageName(stageName);
    }, [stageName]);

    return (
        <div className={styles.timerStage}>
            <label>{t("Stage Name")}</label>
            <input
                type="text"
                placeholder="Stage name"
                value={_stageName}
                onInput={handleStageNameChange}
            />
            {stageTimers.map((t, i) => (
                <AdminTimer
                    key={t.timerId}
                    timer={t}
                    index={i}
                    timers={timers}
                    setTimers={setTimers}
                    setTimersChanged={setTimersChanged}
                />
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
            const newTimer: SetTimer = {
                time: 90 * 1000,
                name: "start",
                order: maxOrder + 1,
                stageName: stageName,
                stageId: stageId,
                timerId: uuidv4(),
            };

            setTimers([...timers, newTimer]);
            setTimersChanged(true);
        } catch (error) {
            console.error(error);
        }
    }

    function handleStageNameChange(ev: any) {
        try {
            //go over all timers and change the stage name
            timers.forEach((t) => {
                if (t.stageId === stageId) {
                    t.stageName = ev.target.value;
                }
            });

            setStageName(ev.target.value);

            setTimersChanged(true);
        } catch (error) {
            console.error(error);
        }
    }
};

export default AdminTimerStage;
