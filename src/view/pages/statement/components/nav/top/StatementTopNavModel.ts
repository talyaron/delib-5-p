import { NavObject, Screen } from "delib-npm";

export const navArray: NavObject[] = [
    { link: Screen.DOC, name: "Main", id: "doc", default: true },
    { link: Screen.CHAT, name: "Chat", id: "main" },
    { link: Screen.OPTIONS, name: "Evaluations", id: "options" },
    {
        link: Screen.QUESTIONS,
        name: "Questions",
        id: "questions",
    },
    { link: Screen.VOTE, name: "Voting", id: "vote" },
    {
        link: Screen.MASS_QUESTIONS,
        name: "Mass Questions",
        id: "questions-mass",
        default: false,
    },
    { link: Screen.GROUPS, name: "Rooms", id: "rooms", default: false },

    { link: Screen.SETTINGS, name: "Settings", id: "settings" },
];