import { logger } from "firebase-functions/v1";
import { db } from "./index";

import { logBase } from "./helpers";





export async function updateEvaluation(event: any) {
    try {

        const {  statementRef, evaluationDeferneces, evaluation, previousEvaluation, error } = getEvaluationInfo();
        if (error) throw error;

       
        const { newPro, newCon } = await setNewEvaluation(statementRef, evaluationDeferneces, evaluation, previousEvaluation);

        //consensu calculations
        const sumEvaluation = newPro - newCon;
        const n = newPro + Math.abs(newCon);
        const nLog = logBase(n, 4);
        const consensus = sumEvaluation*nLog;

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

