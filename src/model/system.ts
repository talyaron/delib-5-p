import { z } from "zod";

export enum Screen {
    HOME = "home",
    STATEMENT = "statement",
    CHAT = "chat",
    OPTIONS = "options",
    VOTE = "vote",
    GROUPS = "groups",
    SETTINGS = "settings",
    OPTIONS_CONSENSUS = "options-consensus",
    OPTIONS_NEW = "options-new",
    OPTIONS_RANDOM = "options-random",
    OPTIONS_UPDATED = "options-updated",
    VOTES_CONSENSUS = "votes-consensus",
    VOTESֹֹֹ_VOTED = "votes-voted",
    VOTES_NEW = "votes-new",
    VOTES_RANDOM = "votes-random",
    VOTES_UPDATED = "votes-updated",
}

//zod schema of screen

export const ScreenSchema = z.enum([
    Screen.HOME,
    Screen.STATEMENT,
    Screen.CHAT,
    Screen.OPTIONS,
    Screen.VOTE,
    Screen.GROUPS,
    Screen.OPTIONS_CONSENSUS,
    Screen.OPTIONS_NEW,
    Screen.OPTIONS_RANDOM,
    Screen.OPTIONS_UPDATED,
    Screen.VOTES_CONSENSUS,
    Screen.VOTESֹֹֹ_VOTED,
    Screen.VOTES_NEW,
    Screen.VOTES_RANDOM,
    Screen.VOTES_UPDATED,
]);
