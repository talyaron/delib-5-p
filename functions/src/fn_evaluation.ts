import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { SimpleStatement } from "delib-npm";





export async function updateEvaluation(event: any) {
    try {



        const { parentId, dataAfter, statementRef, evaluationDeferneces, evaluation, previousEvaluation, error } = getEvaluationInfo();
        if (error) throw error;

        //get parent statement
        const parentRef = db.collection("statements").doc(parentId);

        const statementEvaluatorsRef = db.collection("statementEvaluators");
        const statementEvaluatorDB = await statementEvaluatorsRef.doc(`${dataAfter.evaluatorId}--${parentId}`).get();

        //calculate and update
        const totalAllEvaluators: number = await updateNumberOfEvaluators(statementEvaluatorDB, statementEvaluatorsRef, dataAfter, parentId, parentRef);


        const { newPro, newCon } = await setNewEvaluation(statementRef, evaluationDeferneces, evaluation, previousEvaluation);

        const sumEvaluation = newPro - newCon;
        const n = newPro + Math.abs(newCon);

        const consensus = await calculateConsensus(sumEvaluation, n, totalAllEvaluators);

        //set consensus to statement in DB
        await statementRef.update({ consensus });

        //get maxConsensus of sibbling statements under the parent
        const parentStatementsQuery = db.collection("statements").where("parentId", "==", parentId).orderBy("consensus", "desc").limit(1);
        const parentStatementsDB = await parentStatementsQuery.get();
        const maxConsensusStatement = parentStatementsDB.docs[0].data()

        const { statement: _statement, statementId, parentId: _parentId, creatorId, creator, consensus: _consesus }: SimpleStatement = maxConsensusStatement;
        const maxConsensusStatementSimple: SimpleStatement = { statement: _statement, statementId, parentId: _parentId, creatorId, creator, consensus: _consesus };


        await parentRef.update({ maxConsesusStatement: maxConsensusStatementSimple, totalSubEvaluators: totalEvaluators });

        //send to parent the 



    } catch (error) {
        logger.error(error);
        return;
    }

    //inner functions

    function getEvaluationInfo() {
        try {
            const dataAfter = event.data.after.data();
            const evaluation = dataAfter.evaluation;
            if (evaluation === undefined) throw new Error("evaluation is not defined");

            const dataBefore = event.data.before.data();
            let previousEvaluation = 0;
            if (dataBefore) previousEvaluation = dataBefore.evaluation || 0;
            if (isNaN(previousEvaluation)) throw new Error("previousEvaluation is not a number");
            if (isNaN(evaluation)) throw new Error("evaluation is not a number");

            const evaluationDeferneces: number = evaluation - previousEvaluation || 0;
            if (!evaluationDeferneces) throw new Error("evaluationDeferneces is not defined");

            const statementId = dataAfter.statementId;
            if (!statementId) throw new Error("statementId is not defined");
            const statementRef = db.collection("statements").doc(statementId);

            const parentId = dataAfter.parentId;
            if (!parentId)
                throw new Error("parentId is not defined");
            return { parentId, dataAfter, statementRef, evaluationDeferneces, evaluation, previousEvaluation };
        } catch (error: any) {
            logger.error(error);
            return { error: error.message };
        }
    }

    async function calculateConsensus(sumEvaluations: number, totalEvaluators: number, totalAllEvaluators: number): Promise<number> {
        //(pst-neg, 1, -1)(log1.3(abs(atLeast 1(positive_evaluators_evaluation - negative_evaluators_evaluation)))) / total_evaluators
        try {

            //Consesnsu is calculated as follwing:
            //on spesific statement:, n would be the number of evaluators of this statement.
            //sum of all evaluations on this statement is calculated as follows:
            //Sum of all evaluation * log4(n)

            const groupInfulance = logBase(totalEvaluators, 4);
            const maxGroupInfluance = logBase(totalAllEvaluators, 4);

            // const consensus = sumEvaluations * groupInfulance;
            const maxScore = maxGroupInfluance * totalAllEvaluators;
            const consensus = (sumEvaluations * groupInfulance) / maxScore;


            return consensus;

            function logBase(x: number, b: number) {
                return Math.log(x) / Math.log(b);
            }

        } catch (error) {
            logger.error(error);
            return 0;
        }
    }

    async function setNewEvaluation(statementRef: any, evaluationDeferneces: number | undefined, evaluation: number, previousEvaluation: number | undefined): Promise<{ newCon: number, newPro: number, totalEvaluators: number }> {

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

    async function updateNumberOfEvaluators(statementEvaluatorDB: any, statementEvaluatorsRef: any, dataAfter: any, parentId: any, parentRef: any) {
        try {
            let totalEvaluators = 0;
            if (!statementEvaluatorDB.exists) {
                //add to statementEvaluators
                await statementEvaluatorsRef.doc(`${dataAfter.evaluatorId}--${parentId}`).set({ evaluatorId: dataAfter.evaluatorId, parentId: parentId });

                //if size of parentEvaluationsDB by evaluator is 0 then this is the first evaluation by this user on this statement.add it to the parent statement
                await db.runTransaction(async (t: any) => {
                    try {

                        const parentStatementDB = await t.get(parentRef);



                        if (!parentStatementDB.exists) {
                            throw new Error("parentStatementRef does not exist");
                        }

                        const newTotalEvaluators = parentStatementDB.data().totalEvaluators + 1 || 1;
                        t.update(parentRef, { totalEvaluators: newTotalEvaluators });

                        totalEvaluators = newTotalEvaluators;
                    } catch (error) {
                        logger.error(error);
                    }
                });
            } else {
                const parentStatementDB = await parentRef.get();
                if (!parentStatementDB.exists) {
                    throw new Error("parentStatementRef does not exist");
                }
                totalEvaluators = parentStatementDB.data().totalEvaluators || 0;
            }
            return totalEvaluators;
        } catch (error) {
            logger.error(error);
            return 0;
        }
    }
    // function getBaseLog(x: number, baseLog: number): number {
    //     return Math.log(baseLog) / Math.log(x);
    // }
}

// function absTotalEvaluation(totalEvaluations: number) {

//     return totalEvaluations < 1 ? 1 : totalEvaluations;
// }

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
