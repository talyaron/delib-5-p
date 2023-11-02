import { Collections, ResultsBy, Statement, StatementSchema } from "delib-npm"
import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { z } from "zod";

export async function updateResults(ev: any):Promise<Statement[]> {
    try {

        //get results
        const { resultsBy } = ev.data.after.data();
        const {statementId} = ev.params;

        if (!statementId) throw new Error("statementId is required");
        if (!resultsBy) throw new Error("resultsBy is required");

        const topStatements = await transpileResults(statementId, resultsBy);

        //save results to DB
        await db.collection(Collections.results).doc(statementId).set({ [resultsBy]: topStatements },{merge:true});

        return topStatements;

    } catch (error) {
        logger.error(error)
        return [];
    }
}
async function transpileResults(statementId: string, resultsBy: ResultsBy): Promise<Statement[]> {
    try {
        //get top results by ResultBy
        switch (resultsBy) {
            case ResultsBy.topOption:
                logger.info("topOption")
                return await resultsByTopOptions(statementId);
                case ResultsBy.topVote:
                    logger.info("topVote")
                 return await resultsByTopVotes(statementId);
            default:
                return await resultsByTopOptions(statementId);
        }

    } catch (error) {
        logger.error(error)
        return [];
    }
}


async function resultsByTopOptions(statementId: string): Promise<Statement[]> {
    try {
        //get top options
        // statementRef
        const statementRef = db.collection(Collections.statements).doc(statementId);
        const statementDB = await statementRef.get();
        const statement = statementDB.data() as Statement;
        StatementSchema.parse(statement);

        //get top options
        const topOptionsDB = await db.collection(Collections.statements).where("parentId", "==", statementId).orderBy("consensus", "desc").limit(5).get();
        const topOptions = topOptionsDB.docs.map((doc: any) => doc.data() as Statement);

        z.array(StatementSchema).parse(topOptions);

        return topOptions;
    } catch (error) {
        logger.error(error)
        return [];
    }
}

async function resultsByTopVotes(statementId: string): Promise<Statement[]> {
    try {
        //get top options
        // statementRef
        const statementRef = db.collection(Collections.statements).doc(statementId);
        const statementDB = await statementRef.get();
        const statement = statementDB.data() as Statement;
        StatementSchema.parse(statement);

        //get top selection
        const {selections} = statement;
        if(!selections) throw new Error("selections is required");

       const topStatementId =  Object.keys(selections).reduce((a, b) => selections[a] > selections[b] ? a : b);
         const topStatementRef = db.collection(Collections.statements).doc(topStatementId);
        const topStatementDB = await topStatementRef.get();
        const topStatement = topStatementDB.data() as Statement;
        StatementSchema.parse(topStatement);

        return [topStatement];

    } catch (error) {
        logger.error(error)
        return [];
    }
}