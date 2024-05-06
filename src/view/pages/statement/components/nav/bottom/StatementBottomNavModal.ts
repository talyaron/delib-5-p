import { Screen } from "delib-npm";

export interface NavItem {
    link: Screen;
    name: string;
    id: string;
}

export const optionsArray: NavItem[] = [
    {
        link: Screen.OPTIONS_NEW,
        name: "New",
        id: Screen.OPTIONS_NEW,
    },
    {
        link: Screen.OPTIONS_UPDATED,
        name: "Update",
        id: Screen.OPTIONS_UPDATED,
    },
    {
        link: Screen.OPTIONS_RANDOM,
        name: "Random",
        id: Screen.OPTIONS_RANDOM,
    },
    {
        link: Screen.OPTIONS_CONSENSUS,
        name: "Agreement",
        id: Screen.OPTIONS_CONSENSUS,
    },
];

export const votesArray: NavItem[] = [
    {
        link: Screen.VOTES_NEW,
        name: "New",
        id: Screen.VOTES_NEW,
    },
    {
        link: Screen.VOTES_UPDATED,
        name: "Update",
        id: Screen.VOTES_UPDATED,
    },
    {
        link: Screen.VOTES_RANDOM,
        name: "Random",
        id: Screen.VOTES_RANDOM,
    },
    {
        link: Screen.VOTESֹֹֹ_VOTED,
        name: "Agreement",
        id: Screen.VOTESֹֹֹ_VOTED,
    },
];

export const questionsArray: NavItem[] = [
    {
        link: Screen.QUESTIONS_NEW,
        name: "New",
        id: Screen.QUESTIONS_NEW,
    },
    {
        link: Screen.QUESTIONS_UPDATED,
        name: "Update",
        id: Screen.QUESTIONS_UPDATED,
    },
    {
        link: Screen.QUESTIONS_RANDOM,
        name: "Random",
        id: Screen.QUESTIONS_RANDOM,
    },
    {
        link: Screen.QUESTIONS_CONSENSUS,
        name: "Agreement",
        id: Screen.QUESTIONS_CONSENSUS,
    },
];
