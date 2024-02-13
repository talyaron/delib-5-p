import { SetTimer, Statement } from "delib-npm";
import { updateTimerSettingDB } from "../../../../../../../functions/db/timer/setTimer";
import React from "react";

export function converToMillisecons(timer: number[]) {
    const minutes = timer[0] * 10 + timer[1];
    const seconds = timer[2] * 10 + timer[3];

    return (seconds + minutes * 60) * 1000;
}

export async function handleSetTimers({
    parentStatement,
    timers,
    setTimers,
}: {
    parentStatement: Statement;
    timers: SetTimer[];
    setTimers: React.Dispatch<React.SetStateAction<SetTimer[]>>;
}) {
    const newTimer: SetTimer = {
        timerId: `${parentStatement.statementId}--${timers.length + 1}`,
        time: 60 * 1000,
        name: "Q&A",
        order: timers.length,
    };
    setTimers([...timers, newTimer]);
    updateTimerSettingDB({
        statementId: parentStatement.statementId,
        time: newTimer.time,
        name: newTimer.name,
        order: newTimer.order,
    });
}
