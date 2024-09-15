// import { doc, getDoc } from "firebase/firestore";
// import { DB } from "../config";
// import { Collections } from "delib-npm";
import {
	collection,
	getDocs,
	limit,
	query,
	where,
	orderBy,
} from "@firebase/firestore";
import { DB } from "../config";
import { Collections, ResultsBy, Statement, StatementSchema } from "delib-npm";
import { z } from "zod";

export async function getResultsDB(statement: Statement): Promise<Statement[]> {
	try {
		StatementSchema.parse(statement);

		const { resultsSettings } = statement;
		const resultsBy = resultsSettings?.resultsBy || ResultsBy.topOptions;

		switch (resultsBy) {
		case ResultsBy.topOptions:
			return await getTopOptionsDB(statement);
		default:
			return [];
		}
	} catch (error) {
		console.error(error);

		return [];
	}
}

// async function getResultsByTopVoteDB(
//     statement: Statement,
// ): Promise<Statement[]> {
//     try {
//         //get top voted statement
//         const { selections } = statement;
//         if (!selections) throw new Error("statement has no selections");

//         const topStatementId = maxKeyInObject(selections);

//         const statementRef = doc(DB, Collections.statements, topStatementId);
//         const statementSnap = await getDoc(statementRef);
//         const statementData = statementSnap.data() as Statement;

//         return [statementData];
//     } catch (error) {
//         console.error(error);

//         return [];
//     }
// }

async function getTopOptionsDB(statement: Statement): Promise<Statement[]> {
	try {
		const { resultsSettings } = statement;
		const numberOfOptions = resultsSettings?.numberOfResults || 1;

		const topOptionsRef = collection(DB, Collections.statements);
		const q = query(
			topOptionsRef,
			where("parentId", "==", statement.statementId),
			orderBy("consensus", "asc"),
			limit(numberOfOptions),
		);
		const topOptionsSnap = await getDocs(q);

		const topOptions = topOptionsSnap.docs.map(
			(doc) => doc.data() as Statement,
		);

		z.array(StatementSchema).parse(topOptions);

		return topOptions;
	} catch (error) {
		console.error(error);

		return [];
	}
}
