import { Statement } from "delib-npm";
import { Screen } from "../../../../../model/system";

export function sortOptionsIndex(options: Statement[], sort: string | undefined) {
    let _options = JSON.parse(JSON.stringify(options));

    // sort only the order of the options acording to the sort
    switch (sort) {
        case Screen.VOTES_NEW:
            _options = _options.sort((a: Statement, b: Statement) => {
                return b.createdAt - a.createdAt;
            });
            break;

        case Screen.VOTES_CONSENSUS:
            _options = _options.sort((a: Statement, b: Statement) => {
                return b.consensus - a.consensus;
            });
            break;
        case Screen.VOTES_RANDOM:
            _options = _options.sort(() => Math.random() - 0.5);
            break;
        case Screen.VOTESֹֹֹ_VOTED:
            _options = _options.sort((a: Statement, b: Statement) => {
                const aVoted: number = a.voted === undefined ? 0 : a.voted;
                const bVoted: number = b.voted === undefined ? 0 : b.voted;
                return bVoted - aVoted;
            });
            break;
        case Screen.VOTES_UPDATED:
            _options = _options.sort((a: Statement, b: Statement) => {
                return b.lastUpdate - a.lastUpdate;
            });
            break;
        default:
            break;
    }
    _options = _options.map((option: Statement, i: number) => {
        option.order = i;
        return option;
    });
    _options = _options.sort((a: Statement, b: Statement) => {
        return b.createdAt - a.createdAt;
    });

    return _options;
}
