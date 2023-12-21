import { z } from "zod";
export enum Screen{
    HOME = 'home',
    STATEMENT = 'statement',
    CHAT = 'chat',
    EVALUATION = 'options',
    VOTE = 'vote',
    GROUPS = 'groups',
    SETTINGS = 'settings',
    EVALUATION_CONSENSUS = 'options-consensus',
    EVALUATION_NEW = 'options-new',
    EVALUATION_RANDOM = 'options-random',
    EVALUATION_UPDATED = 'options-updated',
    VOTES_CONSENSUS = 'votes-consensus',
    VOTESֹֹֹ_VOTED = 'votes-voted',
    VOTES_NEW = 'votes-new',
    VOTES_RANDOM = 'votes-random',
    VOTES_UPDATED = 'votes-updated',
}

//zod schema of screen

export const ScreenSchema = z.enum([
    Screen.HOME,
    Screen.STATEMENT,
    Screen.CHAT,
    Screen.EVALUATION,
    Screen.VOTE,
    Screen.GROUPS,
    Screen.EVALUATION_CONSENSUS,
    Screen.EVALUATION_NEW,
    Screen.EVALUATION_RANDOM,
    Screen.EVALUATION_UPDATED,
    Screen.VOTES_CONSENSUS,
    Screen.VOTESֹֹֹ_VOTED,
    Screen.VOTES_NEW,
    Screen.VOTES_RANDOM,
    Screen.VOTES_UPDATED,
]);

export interface NavObject {
    link: Screen;
    name: string;
    id: string;
}