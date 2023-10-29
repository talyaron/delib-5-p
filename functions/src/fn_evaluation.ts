import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { Statement, SimpleStatement } from "delib-npm";


export async function updateEvaluation(event: any) {
    try {



        const { parentId, dataAfter, statementRef, evaluationDeferneces, evaluation, previousEvaluation, error } = getEvaluationInfo();
        if (error) throw error;

        //get parent statement
        const parentRef = db.collection("statements").doc(parentId);

        const statementEvaluatorsRef = db.collection("statementEvaluators");
        const statementEvaluatorDB = await statementEvaluatorsRef.doc(`${dataAfter.evaluatorId}--${parentId}`).get();

        //calculate and update
        const totalEvaluators = await updateNumberOfEvaluators(statementEvaluatorDB, statementEvaluatorsRef, dataAfter, parentId, parentRef);

        const _totalEvaluations = await setNewEvaluation(statementRef, evaluationDeferneces, evaluation, previousEvaluation);

        const consensus = await calculateConsensus(_totalEvaluations, totalEvaluators);

        //get maxConsensus of sibbling statements under the parent
        const parentStatementsQuery = db.collection("statements").where("parentId", "==", parentId).orderBy("consensus", "desc").limit(1);
        const parentStatementsDB = await parentStatementsQuery.get();

        const { statement: _statement, statementId, parentId: _parentId, creatorId, creator, consensus: _consesus }: SimpleStatement = parentStatementsDB.docs[0].data();
        const maxConsensusStatement: SimpleStatement = { statement: _statement, statementId, parentId: _parentId, creatorId, creator, consensus: _consesus };
        let maxConsensus = 0;
        if (!parentStatementsDB.empty) {
            maxConsensus = maxConsensusStatement.consensus;
        }

        if (consensus > maxConsensus) {

            // get parent statement
            const statementDB = await parentRef.get();
            const statement = statementDB.data() as Statement;

            //set parent consensus to maxConsensus
            await parentRef.update({ maxConsesusStatement: statement, maxConsensus });
        } else {
            //set parent consensus to maxConsensus
            await parentRef.update({ maxConsesusStatement: maxConsensusStatement, maxConsensus });
        }

        //set consensus to statement in DB
        await statementRef.update({ consensus });

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

    async function calculateConsensus(_totalEvaluations: number, totalEvaluatorEvaluations: any): Promise<number> {
        //(pst-neg, 1, -1)(log1.3(abs(atLeast 1(positive_evaluators_evaluation - negative_evaluators_evaluation)))) / total_evaluators
        try {


            const proEvaluation = (() => {
                if (_totalEvaluations < 0) {
                    return -1;
                }
                return 1;
            })();

            const totalEvaluations = beforeLogCalculation(Math.abs(_totalEvaluations));

            const totalLogEvaluations = Math.log2(totalEvaluations);

            const consensus = proEvaluation * (totalLogEvaluations / totalEvaluatorEvaluations);


            return consensus;
        } catch (error) {
            logger.error(error);
            return 0;
        }
    }

    async function setNewEvaluation(statementRef: any, evaluationDeferneces: number | undefined, evaluation: number, previousEvaluation: number | undefined): Promise<number> {

        let newTotalEvaluations: number = 0;
        await db.runTransaction(async (t: any) => {
            try {
                if (!evaluationDeferneces) throw new Error("evaluationDeferneces is not defined");
                if (evaluation === undefined) throw new Error("evaluation is not defined");
                if (previousEvaluation === undefined) throw new Error("previousEvaluation is not defined error");

                const statementDB = await t.get(statementRef);

                if (!statementDB.exists) {
                    throw new Error("statement does not exist");
                }

                newTotalEvaluations = statementDB.data().totalEvaluations;
                const oldPro = statementDB.data().pro || 0;
                const oldCon = statementDB.data().con || 0;


                const { newCon, newPro } = updateProCon(oldPro, oldCon, evaluation, previousEvaluation);


                if (newTotalEvaluations === undefined)
                    newTotalEvaluations = 0;


                newTotalEvaluations += evaluationDeferneces;

                t.update(statementRef, { totalEvaluations: newTotalEvaluations, con: newCon, pro: newPro });

                // return newTotalEvaluations
            } catch (error) {
                logger.error(error);
                // return 0;
            }
        });
        return newTotalEvaluations;

        function updateProCon(oldPro: number, oldCon: number, evaluation: number, previousEvaluation: number): { newPro: number, newCon: number } {
            try {
                logger.info(`oldPro: ${oldPro}, oldCon: ${oldCon}`);
                let newPro = oldPro;
                let newCon = oldCon;

                const { pro, con } = clacProCon(previousEvaluation, evaluation);
                logger.info(`pro: ${pro}, con: ${con}`);
                newPro += pro;
                newCon += con;

                logger.info(`newPro: ${newPro}, newCon: ${newCon}`);

                return { newPro, newCon };
            } catch (error) {
                logger.error(error);
                return { newPro: oldPro, newCon: oldCon };
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

function beforeLogCalculation(totalEvaluations: number) {
    if (totalEvaluations < 1) {
        return 1
    }
    return totalEvaluations
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
