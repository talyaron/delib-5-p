import { Statement } from "delib-npm";
import { Screen } from "../../../../../model/system";

export function sortSubStatements(
    subStatements: Statement[],
    sort: string | undefined
) {
    try {
        let _subStatements = [...subStatements];
        switch (sort) {
            case Screen.EVALUATION_CONSENSUS:
                _subStatements = subStatements.sort(
                    (a: Statement, b: Statement) => b.consensus - a.consensus
                );
                break;
            case Screen.EVALUATION_NEW:
                _subStatements = subStatements.sort(
                    (a: Statement, b: Statement) => b.createdAt - a.createdAt
                );
                break;
            case Screen.EVALUATION_RANDOM:
                _subStatements = subStatements.sort(() => Math.random() - 0.5);
                break;
            case Screen.EVALUATION_UPDATED:
                _subStatements = subStatements.sort(
                    (a: Statement, b: Statement) => b.lastUpdate - a.lastUpdate
                );
                break;
        }
        const __subStatements = _subStatements.map(
            (statement: Statement, i: number) => {
                statement.order = i;
                return statement;
            }
        );

        return __subStatements;
    } catch (error) {
        console.error(error);
        return subStatements;
    }
}
