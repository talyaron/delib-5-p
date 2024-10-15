import { AgreeDisagree, AgreeDocument, Collections } from "delib-npm";
import { logger } from "firebase-functions/v1";
import { db } from ".";




export async function updateAgrees(event: any) {
    try {
        const agreeAfterData = event.data.after.data() as AgreeDisagree | undefined;
        const agreeBeforeData = event.data.before.data() as AgreeDisagree | undefined;
        const agreeAfter: number = agreeAfterData?.agree || 0;
        const agreeBefore: number = agreeBeforeData?.agree || 0;
       

        const { diffInAgree, diffInDisagree } = agreeDisagreeDifferences(agreeBefore, agreeAfter);


        const combinedAgreement = { ...agreeAfterData, ...agreeBeforeData } as AgreeDisagree;


        const statementRef = db.collection(Collections.statements).doc(combinedAgreement.statementId);
        await db.runTransaction(async (t) => {
            const statement = await t.get(statementRef);
            if (!statement.exists) throw new Error("Statement not found");

            const agree = statement.data()?.documentAgree?.agree || 0;
            const disagree = statement.data()?.documentAgree?.disagree || 0;


            const newAgree = agree + diffInAgree;
            const newDisagree = disagree + diffInDisagree;
            const totalAgree = newAgree + newDisagree;

            const updateAgrees: AgreeDocument = {
                agree: newAgree,
                disagree: newDisagree,
                avgAgree: totalAgree !== 0 ? (newAgree - newDisagree) / totalAgree : 0,
            }


            t.update(statementRef, { documentAgree: updateAgrees });
        });

    } catch (error) {
        logger.error(error);
    }
}

export function agreeDisagreeDifferences(agreeBefore: number, agreeAfter: number): { diffInAgree: number, diffInDisagree: number } {
    try {
        const diffDisagree = Math.min(agreeBefore, 0) - Math.min(agreeAfter, 0);
        const diffAgree = Math.max(agreeAfter, 0) - Math.max(agreeBefore, 0);
        return {
            diffInAgree: diffAgree,
            diffInDisagree: diffDisagree
        };
    } catch (error) {
        console.error(error);
        return {
            diffInAgree: 0,
            diffInDisagree: 0
        }
    }
};


