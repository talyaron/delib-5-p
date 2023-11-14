import { Statement } from "delib-npm";
import { maxKeyInObject } from "../../../../../../functions/general/helpers";


export function getTopVoteStatementId(statement: Statement): string | undefined {
    try {
        const { selections } = statement;
        if (!selections) return undefined;

        const maxVoteKey = maxKeyInObject(selections);
        return maxVoteKey;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
