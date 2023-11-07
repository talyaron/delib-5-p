// import { doc, getDoc } from "firebase/firestore";
// import { DB } from "../config";
// import { Collections } from "delib-npm";
import { collection, doc, getDoc, getDocs, limit, query, where } from "@firebase/firestore";
import { DB } from "../config";
import { Collections, ResultsBy, Statement, StatementSchema } from "delib-npm";
import { maxKeyInObject } from "../../general/helpers";

interface getResultsFromDBProps {
    statement: Statement,
    resultsBy: ResultsBy,
    numberOfOptions?: number,
    deep?: number
}

export async function getResultsFromDB({ statement, resultsBy, numberOfOptions = 1, deep = 1 }: getResultsFromDBProps): Promise<Statement[]> {
    try {
        StatementSchema.parse(statement);
        console.log(deep, numberOfOptions)

        switch (resultsBy) {
            case ResultsBy.topVote:
                return await getResultsByTopVote(statement);
            case ResultsBy.topOptions:
                return await getTopOtions(statement, numberOfOptions);
            default:
                return [];
        }



    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getResultsByTopVote(statement: Statement): Promise<Statement[]> {
    try {
        //get top voted statement
        const { selections } = statement;
        if (!selections) throw new Error("statement has no selections");

        const topStatementId = maxKeyInObject(selections);

        const statementRef = doc(DB, Collections.resultsTriggers, topStatementId);
        const statementSnap = await getDoc(statementRef);
        const statementData = statementSnap.data() as Statement;
        return [statementData];
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getTopOtions(statement: Statement, numberOfOptions: number): Promise<Statement[]> {
    try {
        const topOptionsRef = collection(DB, Collections.statements);
        const q = query(topOptionsRef, where('parentId', '==', statement.statementId), limit(numberOfOptions));
        const topOptionsSnap = await getDocs(q);

        const topOptions = topOptionsSnap.docs.map(doc => doc.data() as Statement);
        return topOptions;
    } catch (error) {
        console.error(error);
        return [];
    }
}