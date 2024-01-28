import { SetTimer, Statement } from "delib-npm";
import { setParentTimersToDB } from "../../../../../../../functions/db/timer/setTimer";

export function converToMillisecons(timer: number[]) {
    const minutes = timer[0] * 10 + timer[1];
    const seconds = timer[2] * 10 + timer[3];
    return (seconds + minutes * 60) * 1000;
}

export function handleSetTimers({
    parentStatement,
    timers,
}: {
    parentStatement: Statement;
    timers: SetTimer[];
}) {
    setParentTimersToDB({ parentStatement, timers });
}