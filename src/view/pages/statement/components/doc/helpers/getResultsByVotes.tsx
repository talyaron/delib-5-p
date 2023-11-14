import { Results, Statement } from "delib-npm";
import { getTopVoteStatementId } from "./getTopVoteStatementId";


export function getResultsByVotes(
    statement: Statement,
    subStatements: Statement[]
): Results[] {
    try {
        const maxVoteKey = getTopVoteStatementId(statement);
        if (!maxVoteKey) return [];
        const maxVoteStatement: Statement | undefined = subStatements.find(
            (subStatement) => subStatement.statementId === maxVoteKey
        );
        if (!maxVoteStatement) return [];
        const result: Results = { top: maxVoteStatement };

        return [result];
    } catch (error) {
        console.error(error);
        return [];
    }
}
