import { SetTimer } from "delib-npm";

export const initialTimerArray: SetTimer[] = [
    {
        timerId: "1",
        time: 60*1000,
        name: "My challanges",
        order: 0,
        stageName: "Stage 1",
        stageId: "stage1",
    },
    {
        timerId: "2",
        time: 60*1000,
        name: "Q&A",
        order: 1,
        stageName: "Stage 1",
        stageId: "stage1",
    },

    {
        timerId: "3",
        time: 60*1000,
        name: "My solution",
        order: 0,
        stageName: "Stage 2",
        stageId: "stage2",
    },
    {
        timerId: "4",
        time: 60*1000,
        name: "Q&A",
        order: 1,
        stageName: "Stage 2",
        stageId: "stage2",
    },

    {
        timerId: "5",
        time: 5 * 60 * 1000,
        name: "Group solutions",
        order: 0,
        stageName: "Stage 3",
        stageId: "stage3",
    },
];
