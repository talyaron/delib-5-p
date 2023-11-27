import { Statement } from "delib-npm";
import { Screen } from "../../../../../model/system";

export function sortSubStatements(
    subStatements: Statement[],
    sort: string | undefined
) {
    try {
        let _subStatements = [...subStatements];
        switch (sort) {
            case Screen.OPTIONS_CONSENSUS:
                _subStatements = subStatements.sort(
                    (a: Statement, b: Statement) => b.consensus - a.consensus
                );
                break;
            case Screen.OPTIONS_NEW:
                _subStatements = subStatements.sort(
                    (a: Statement, b: Statement) => b.createdAt - a.createdAt
                );
                break;
            case Screen.OPTIONS_RANDOM:
                _subStatements = subStatements.sort(() => Math.random() - 0.5);
                break;
            case Screen.OPTIONS_UPDATED:
                _subStatements = subStatements.sort(
                    (a: Statement, b: Statement) => b.lastUpdate - a.lastUpdate
                );
                break;
            
        }
         _subStatements.forEach((statement: Statement, i: number) => {
            statement.order = i;
        })

        return _subStatements.sort((b: Statement, a: Statement) => a.createdAt - b.createdAt);
        
    } catch (error) {
        console.error(error);
        return subStatements;
    }
}
