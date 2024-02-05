import { SetTimer, Statement } from "delib-npm";
import { setParentTimersToDB } from "../../../../../../../functions/db/timer/setTimer";
import { uuidv4 } from "@firebase/util";

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
    setTimersChanged: Function;
}) {
    await setParentTimersToDB({ parentStatement,userCanChangeTimer:true, timers });
    setTimersChanged(false);
}

export function orderByStagesAndOrderFromTimers(timers: SetTimer[]): SetTimer[][] {
    try {
        const orderedTimersByStage:SetTimer[][] = [];

        const stages: string[] = [];

        timers.forEach((timer) => {
            if (!stages.includes(timer.stageId)) stages.push(timer.stageId);
        });

        stages.forEach((stage, i) => {
            const orderedTimers = timers
                .filter((timer) => timer.stageId === stage)
                .sort((a, b) => a.order - b.order);
            orderedTimersByStage[i] = orderedTimers;
        });
        return orderedTimersByStage;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export function handleAddStage(timers:SetTimer[],setTimers:Function) {
    try {
       const stagesSet = new Set()
         timers.forEach(timer => stagesSet.add(timer.stageId))
         const numberOfStages = stagesSet.size;
        const newTimer = {stageId: uuidv4(), stageName:`New Stage ${numberOfStages}`, order: 0, name:"", time: 90*1000, timerId: uuidv4()};
        setTimers([...timers , newTimer])
    } catch (error) {
        console.error(error);
        return timers;
    }
}
