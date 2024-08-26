import { AgreeDisagree, AgreeDisagreeEnum, AgreeDocument, Collections } from "delib-npm";
import { logger } from "firebase-functions/v1";
import { db } from ".";
import { Action, getAction } from "./fn_approval";


export async function updateAgrees(event: any) {
    try {
        const agreeAfterData = event.data.after.data() as AgreeDisagree | undefined;
        const agreeBeforeData = event.data.before.data() as AgreeDisagree | undefined;
        const combinedAgreement = { ...agreeAfterData, ...agreeBeforeData } as AgreeDisagree;
        if (!combinedAgreement) throw new Error("No agreement data found");

        const action = getAction(event);
        let results: AgreeDocument = { agree: 0, disagree: 0 };

        if (action === Action.create) {
            if (!agreeAfterData) throw new Error("No agreement data found");
            const { agree } = agreeAfterData;

            results = getUpdateCreateAgree(combinedAgreement.statementId, agree);
        } else if (action === Action.delete) {
            if (!agreeBeforeData) throw new Error("No agreement data found");
            const { agree } = agreeBeforeData;

            results = getUpdateDeleteAgree(combinedAgreement.statementId, agree);
        } else if (action === Action.update) {
            if (!agreeAfterData) throw new Error("No agreement data found");
            const { agree: agreeAfter } = agreeAfterData;
            const { agree: agreeBefore } = agreeBeforeData || { agree: undefined };
            if (agreeAfter === undefined) throw new Error("No agreement data found");
            if (agreeBefore === undefined) throw new Error("No agreement data found");
            if (agreeAfter === agreeBefore) return;

            results = getUpdateUpdateAgree(combinedAgreement.statementId, agreeAfter, agreeBefore);

        }

        const statementRef = db.collection(Collections.statements).doc(combinedAgreement.statementId);
        await db.runTransaction(async (t) => {
            const statement = await t.get(statementRef);
            if (!statement.exists) throw new Error("Statement not found");

            const { agree, disagree } = statement.data()?.documentAgree || { agree: 0, disagree: 0 } as AgreeDocument;
            const { agree: updateAgree, disagree: updateDisagree } = results;



            const newAgree = agree + updateAgree;
            const newDisagree = disagree + updateDisagree;
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



function getUpdateCreateAgree(statementId: string, agree: AgreeDisagreeEnum): AgreeDocument {


    if (agree === AgreeDisagreeEnum.Agree) {
        return { agree: 1, disagree: 0 };
    } else if (agree === AgreeDisagreeEnum.Disagree) {
        return { agree: 0, disagree: 1 };
    }
    return { agree: 0, disagree: 0 };
}

function getUpdateDeleteAgree(statementId: string, agree: AgreeDisagreeEnum): AgreeDocument {

    if (agree === AgreeDisagreeEnum.Agree) {
        return { agree: -1, disagree: 0 };
    } else if (agree === AgreeDisagreeEnum.Disagree) {
        return { agree: 0, disagree: -1 };
    }
    return { agree: 0, disagree: 0 };
}

function getUpdateUpdateAgree(statementId: string, agreeAfter: AgreeDisagreeEnum, agreeBefore: AgreeDisagreeEnum): AgreeDocument {
    try {

        const { Agree, Disagree, NoOpinion } = AgreeDisagreeEnum;



        if (agreeBefore === Disagree && agreeAfter === Agree) {
            return { agree: 1, disagree: -1 };
        } else if (agreeBefore === Agree && agreeAfter === Disagree) {
            return { agree: -1, disagree: 1 };
        } else if (agreeBefore === NoOpinion) {
            if (agreeAfter === Agree) {
                return { agree: 1, disagree: 0 };
            } else if (agreeAfter === Disagree) {
                return { agree: 0, disagree: 1 };
            }
        }
        return { agree: 0, disagree: 0 };


    } catch (error) {
        logger.error(error);
        return { agree: 0, disagree: 0 };
    }
}