// import { doc, getDoc } from "firebase/firestore";
// import { DB } from "../config";
// import { Collections } from "delib-npm";
import { collection, doc, getDoc, getDocs, limit, query, where, orderBy } from "@firebase/firestore";
import { DB } from "../config";
import { Collections, ResultsBy, Statement, StatementSchema, maxKeyInObject } from "delib-npm";





export async function getResultsDB( statement:Statement): Promise<Statement[]> {
    try {
        StatementSchema.parse(statement);
      
        const { results } = statement;
        const resultsBy = results?.resultsBy || ResultsBy.topOptions;

        switch (resultsBy) {
            case ResultsBy.topVote:
                return await getResultsByTopVoteDB(statement);
            case ResultsBy.topOptions:
                return await getTopOtionsDB(statement);
            default:
                return [];
        }



    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getResultsByTopVoteDB(statement: Statement): Promise<Statement[]> {
    try {
        //get top voted statement
        const { selections } = statement;
        if (!selections) throw new Error("statement has no selections");

        const topStatementId = maxKeyInObject(selections);

        const statementRef = doc(DB, Collections.statements, topStatementId);
        const statementSnap = await getDoc(statementRef);
        const statementData = statementSnap.data() as Statement;
        return [statementData];
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getTopOtionsDB(statement: Statement): Promise<Statement[]> {
    try {
        const { results } = statement;
        const numberOfOptions = results?.numberOfResults || 1;

        const topOptionsRef = collection(DB, Collections.statements);
        const q = query(topOptionsRef, where('parentId', '==', statement.statementId), orderBy("consensus", "asc"), limit(numberOfOptions));
        const topOptionsSnap = await getDocs(q);

        const topOptions = topOptionsSnap.docs.map(doc => doc.data() as Statement);
        return topOptions;
    } catch (error) {
        console.error(error);
        return [];
    }
}