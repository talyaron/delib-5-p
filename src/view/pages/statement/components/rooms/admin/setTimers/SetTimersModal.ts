import { SetTimer } from "delib-npm";

export const initialTimerArray: SetTimer[] = [
    {
        timerId: "1",
        time: 60*1000,
        name: "talk",
        order: 0,  

    },
    {
        timerId: "2",
        time: 60*1000,
        name: "Q&A",
        order: 1,

    }
];
