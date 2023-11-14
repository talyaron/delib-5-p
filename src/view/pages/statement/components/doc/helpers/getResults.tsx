import { Results, ResultsBy, Statement } from "delib-npm";
import { getResultsDB } from "../../../../../../functions/db/results/getResults";
import { getResultsByOptions } from "./getResultsByOptions";
import { getResultsByVotes } from "./getResultsByVotes";

export async function getResults(
    statement: Statement,
    subStatements: Statement[],
    resultsBy: ResultsBy,
    numberOfResults: number
): Promise<Results> {
    try {
        // const { results } = statement;
        console.log("resultsBy", resultsBy, "numberOfResults", numberOfResults);

        const result: Results = { top: statement };

        switch (resultsBy) {
            case ResultsBy.topOne:
            case ResultsBy.topVote:
                result.sub = [...getResultsByVotes(statement, subStatements)];
                break;
            case ResultsBy.topOptions:
                result.sub = [
                    ...getResultsByOptions(subStatements, numberOfResults),
                ];
                break;
            default:
                result.sub = [];
        }

        const subResultsPromises = result.sub.map(
            async (subResult: Results) => {
                const subStatement = subResult.top;
                const subResults: Statement[] = await getResultsDB(subStatement);
                console.log(
                    `subResults ${subResult.top.statement}:`,
                    subResults
                );
                return subResults;
            }
        );

        const resultsStatements = await Promise.all(subResultsPromises);

        result.sub.forEach((_: Results, index: number) => {
            if (!result.sub) return;
            result.sub[index].sub = [
                ...resultsStatements[index].map((subStatement: Statement) => ({
                    top: subStatement,
                })),
            ];
        });

        return result;
    } catch (error) {
        console.error(error);
        return { top: statement };
    }
}
