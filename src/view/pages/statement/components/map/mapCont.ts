import { Statement, ResultsBy, Results, isOptionFn } from "delib-npm";
import { getResultsDB } from "@/controllers/db/results/getResults";

export async function getResults(
	statement: Statement,
	subStatements: Statement[],
	resultsBy: ResultsBy,
	numberOfResults: number,
): Promise<Results> {
	try {
		// const { results } = statement;

		const result: Results = { top: statement, sub: [] };

		switch (resultsBy) {
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
				const subResults: Statement[] =
                    await getResultsDB(subStatement);

				return subResults;
			},
		);

		const resultsStatements = await Promise.all(subResultsPromises);

		result.sub.forEach((_: Results, index: number) => {
			if (!result.sub) return;
			result.sub[index].sub = [
				...resultsStatements[index].map((subStatement: Statement) => ({
					top: subStatement,
					sub: [],
				})),
			];
		});

		return result;
	} catch (error) {
		console.error(error);

		return { top: statement, sub: [] };
	}
}
function getResultsByOptions(
	subStatements: Statement[],
	numberOfResults: number,
): Results[] {
	try {
		const maxOptions: Statement[] = subStatements
			.filter((s) => isOptionFn(s))
			.sort((b, a) => a.consensus - b.consensus)
			.slice(0, numberOfResults || 1);

		const _maxOptions = maxOptions.map((topStatement: Statement) => ({
			top: topStatement,
			sub: [],
		}));

		return _maxOptions;
	} catch (error) {
		console.error(error);

		return [];
	}
}

// function getResultsByVotes(
//     statement: Statement,
//     subStatements: Statement[],
// ): Results[] {
//     try {
//         const maxVoteKey = getTopVoteStatementId(statement);
//         if (!maxVoteKey) return [];
//         const maxVoteStatement: Statement | undefined = subStatements.find(
//             (subStatement) => subStatement.statementId === maxVoteKey,
//         );
//         if (!maxVoteStatement) return [];
//         const result: Results = { top: maxVoteStatement, sub: [] };

//         return [result];
//     } catch (error) {
//         console.error(error);

//         return [];
//     }
// }

// function getTopVoteStatementId(statement: Statement): string | undefined {
//     try {
//         const { selections } = statement;
//         if (!selections) return undefined;

//         const maxVoteKey = maxKeyInObject(selections);

//         return maxVoteKey;
//     } catch (error) {
//         console.error(error);

//         return undefined;
//     }
// }
