import { SetTimer, Statement } from "delib-npm";
import { setParentTimersToDB } from "../../../../../../../functions/db/timer/setTimer";
import React from "react";

export function converToMillisecons(timer: number[]) {
    const minutes = timer[0] * 10 + timer[1];
    const seconds = timer[2] * 10 + timer[3];
    
return (seconds + minutes * 60) * 1000;
}

export async function handleSetTimers({
    parentStatement,
    timers,
    setTimersChanged
}: {
    parentStatement: Statement;
    timers: SetTimer[];
    setTimersChanged: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    await setParentTimersToDB({ parentStatement,userCanChangeTimer:true, timers });
    setTimersChanged(false);
}


