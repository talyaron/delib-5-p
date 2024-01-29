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

export function orderByStagesAndOrderFromTimers(timers: SetTimer[]): SetTimer[][] {
    try {
        const orderedTimersByStage:SetTimer[][] = [];

        const stages: string[] = [];

        timers.forEach((timer) => {
            if (!stages.includes(timer.stage)) stages.push(timer.stage);
        });

        stages.forEach((stage, i) => {
            const orderedTimers = timers
                .filter((timer) => timer.stage === stage)
                .sort((a, b) => a.order - b.order);
            orderedTimersByStage[i] = orderedTimers;
        });
        return orderedTimersByStage;
    } catch (error) {
        console.error(error);
        return [];
    }
}
