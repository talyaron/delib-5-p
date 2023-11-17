import { logger } from "firebase-functions/v1";
import { db } from "./index";

import { logBase } from "./helpers";
import { Collections, Evaluation, EvaluationSchema, ResultsBy, SimpleStatement, Statement, StatementSchema, maxKeyInObject } from "delib-npm";




//update evaluation of a statement
export async function updateEvaluation(event: any) {
    try {

        const { statementId, parentId, evaluationDeferneces, evaluation, previousEvaluation, error } = getEvaluationInfo();
        if (error) throw error;

        const statementRef = db.collection("statements").doc(statementId);
        const { newPro, newCon } = await setNewEvaluation(statementRef, evaluationDeferneces, evaluation, previousEvaluation);

        // Consensus calculations
        // The aim of the consesus calulation is to give statement with more positive evaluation and less vegative evaluations,
        // while letting small groups with heigher consesus an uper hand, over large groups with alot of negative evaluations.

        const sumEvaluation = newPro - newCon;
        const n = newPro + Math.abs(newCon);
        const nLog = logBase(n, 2);
        const consensus = sumEvaluation / nLog;

        //set consensus to statement in DB
        await statementRef.update({ consensus });

        //update parent statement?
        //get parent statement
        updateParentStatementWithChildResults(parentId)



    } catch (error) {
        logger.error(error);
        return;
    }

    //inner functions

    function getEvaluationInfo() {
        try {
            const statementEvaluation = event.data.after.data() as Evaluation;
            EvaluationSchema.parse(statementEvaluation);
            const { evaluation, statementId, parentId } = statementEvaluation;



            const dataBefore = event.data.before.data();
            let previousEvaluation = 0;
            if (dataBefore) previousEvaluation = dataBefore.evaluation || 0;
            if (isNaN(previousEvaluation)) throw new Error("previousEvaluation is not a number");
            if (isNaN(evaluation)) throw new Error("evaluation is not a number");

            const evaluationDeferneces: number = evaluation - previousEvaluation || 0;
            if (!evaluationDeferneces) throw new Error("evaluationDeferneces is not defined");



            return { parentId, statementId, evaluationDeferneces, evaluation, previousEvaluation };
        } catch (error: any) {
            logger.error(error);
            return { error: error.message };
        }
    }


    async function setNewEvaluation(statementRef: any, evaluationDeferneces: number | undefined, evaluation: number = 0, previousEvaluation: number | undefined): Promise<{ newCon: number, newPro: number, totalEvaluators: number }> {

        const results = { newCon: 0, newPro: 0, totalEvaluators: 0 };
        await db.runTransaction(async (t: any) => {
            try {
                if (!evaluationDeferneces) throw new Error("evaluationDeferneces is not defined");
                if (evaluation === undefined) throw new Error("evaluation is not defined");
                if (previousEvaluation === undefined) throw new Error("previousEvaluation is not defined error");

                const statementDB = await t.get(statementRef);

                if (!statementDB.exists) {
                    throw new Error("statement does not exist");
                }


                const oldPro = statementDB.data().pro || 0;
                const oldCon = statementDB.data().con || 0;


                const { newCon, newPro, totalEvaluators } = updateProCon(oldPro, oldCon, evaluation, previousEvaluation);
                results.newCon = newCon;
                results.newPro = newPro;
                results.totalEvaluators = totalEvaluators;


                t.update(statementRef, { totalEvaluations: newCon + newPro, con: newCon, pro: newPro });

                return results;
            } catch (error) {
                logger.error(error);
                return results
            }
        });

        return results


        function updateProCon(oldPro: number, oldCon: number, evaluation: number, previousEvaluation: number): { newPro: number, newCon: number, totalEvaluators: number } {
            try {
                logger.info(`oldPro: ${oldPro}, oldCon: ${oldCon}`);
                let newPro = oldPro;
                let newCon = oldCon;

                const { pro, con } = clacProCon(previousEvaluation, evaluation);
                logger.info(`pro: ${pro}, con: ${con}`);
                newPro += pro;
                newCon += con;
                const totalEvaluators: number = newPro + newCon;

                logger.info(`newPro: ${newPro}, newCon: ${newCon}`);

                return { newPro, newCon, totalEvaluators };
            } catch (error) {
                logger.error(error);
                return { newPro: oldPro, newCon: oldCon, totalEvaluators: 0 };
            }
        }
    }

}

function clacProCon(prev: number, curr: number): { pro: number, con: number } {
    try {
        let pro = 0, con = 0;
        if (prev > 0) {
            pro = -prev
        } else if (prev < 0) {
            con = prev
        }

        if (curr > 0) {
            pro += curr
        } else if (curr < 0) {
            con -= curr
        }
        return { pro, con };
    } catch (error) {
        console.error(error);
        return { pro: 0, con: 0 };
    }
}

interface ResultsSettings {
    resultsBy: ResultsBy,
    numberOfResults?: number,
    deep?: number,
    minConsensus?: number,
    solutions?: SimpleStatement[],
}


function getResultsSettings(results: ResultsSettings | undefined): ResultsSettings {
    if (!results) {
        return {
            resultsBy: ResultsBy.topOne
        }
    } else {
        return results
    }
}

async function updateParentStatementWithChildResults(parentId: string | undefined) {
    try {
        if (!parentId) throw new Error("parentId is not defined");

        const parentStatementRef = await db.collection(Collections.statements).doc(parentId);
        const parentStatementDB = await parentStatementRef.get();
        const parentStatement = parentStatementDB.data() as Statement;
        StatementSchema.parse(parentStatement);

        const { results, selections } = parentStatement;

        let { resultsBy } = getResultsSettings(results);

        if (!selections) resultsBy = ResultsBy.topOptions;

        switch (resultsBy as ResultsBy) {
            case ResultsBy.topVote:


                if (!selections) throw new Error("selection is not defined");
                const maxVoteKey = maxKeyInObject(selections);
                if (!maxVoteKey) throw new Error("maxVoteKey is not defined");
                const topVoteStatementRef = db.collection(Collections.statements).doc(maxVoteKey);

                const topVoteStatement = await topVoteStatementRef.get();
                const topVoteStatementData = topVoteStatement.data() as Statement;
                StatementSchema.parse(topVoteStatementData);

                await topVoteStatementRef.update({ results: { solutions: [topVoteStatementData] } });
                break;
            case ResultsBy.topOptions:
                const { numberOfResults =1 } = getResultsSettings(results);
                const topOptionsRef = db.collection(Collections.statements).where("parentId", "==", parentId).orderBy("consensus", "desc").limit(numberOfResults);
                const topOptionsSnap = await topOptionsRef.get();
                const topOptions = topOptionsSnap.docs.map((st: any) => st.data() as Statement);
                await parentStatementRef.update({ results: { solutions: topOptions } });
                break;
        }



    } catch (error) {
        logger.error(error);
    }
}

