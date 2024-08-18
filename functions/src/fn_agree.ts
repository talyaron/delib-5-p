import { AgreeDisagree, AgreeDisagreeEnum, Collections } from "delib-npm";
import { logger } from "firebase-functions/v1";
import { db } from ".";
import { getAction } from "./fn_approval";
import { FieldValue } from "firebase-admin/firestore";

export async function updateAgrees(event: any) {
    try {
        const agreeAfterData = event.data.after.data() as AgreeDisagree | undefined;
        const agreeBeforeData = event.data.before.data() as AgreeDisagree | undefined;
        const combinedAgreement = { ...agreeAfterData, ...agreeBeforeData } as AgreeDisagree;
        if (!combinedAgreement) throw new Error("No agreement data found");

        const action = getAction(event);

        if (action === "create") {
            if (!agreeAfterData) throw new Error("No agreement data found");
            const { agree } = agreeAfterData;

            onCreateAgree(combinedAgreement.statementId, agree);
        } else if (action === "delete") {
            if (!agreeBeforeData) throw new Error("No agreement data found");
            const { agree } = agreeBeforeData;

            onDeleteAgree(combinedAgreement.statementId, agree);
        } else if (action === "update") {
            if (!agreeAfterData) throw new Error("No agreement data found");
            const { agree: agreeAfter } = agreeAfterData;
            const { agree: agreeBefore } = agreeBeforeData || { agree: undefined };
            if (agreeAfter === undefined) throw new Error("No agreement data found");
            if (agreeBefore === undefined) throw new Error("No agreement data found");
            if (agreeAfter === agreeBefore) return;

            onUpdateAgree(combinedAgreement.statementId, agreeAfter, agreeBefore);

        }

    } catch (error) {
        logger.error(error);
    }
}

function onCreateAgree(statementId: string, agree: AgreeDisagreeEnum) {
    console.log("create agree", agree);
    const statementRef = db.collection(Collections.statements).doc(statementId);
    if (agree === AgreeDisagreeEnum.Agree) {
        statementRef.update({ documentAgree: { agree: FieldValue.increment(1), disagree:0 } });
    } else if (agree === AgreeDisagreeEnum.Disagree) {
        statementRef.update({ documentAgree: { disagree: FieldValue.increment(1),agree:0 } });
    }
}

function onDeleteAgree(statementId: string, agree: AgreeDisagreeEnum) {
    console.log("delete agree", agree);
    const statementRef = db.collection(Collections.statements).doc(statementId);
    if (agree === AgreeDisagreeEnum.Agree) {
        statementRef.update({ documentAgree: { agree: FieldValue.increment(-1) } });
    } else if (agree === AgreeDisagreeEnum.Disagree) {
        statementRef.update({ documentAgree: { disagree: FieldValue.increment(-1) } });
    }
}

function onUpdateAgree(statementId: string, agreeAfter: AgreeDisagreeEnum, agreeBefore: AgreeDisagreeEnum) {
    try {
        console.log("update agree", agreeBefore, agreeAfter);
        const { Agree, Disagree, NoOpinion } = AgreeDisagreeEnum;
        const statementRef = db.collection(Collections.statements).doc(statementId);
        let agree = 0;
        let disagree = 0;

        if (agreeBefore === Disagree && agreeAfter === Agree) {
            agree = 1;
            disagree = -1;
        } else if (agreeBefore === Agree && agreeAfter === Disagree) {
            agree = -1;
            disagree = 1;
        } else if (agreeBefore === NoOpinion) {
            if (agreeAfter === Agree) {
                agree = 1;
            } else if (agreeAfter === Disagree) {
                disagree = 1;
            }
        }

        console.log("agree", agree, "disagree", disagree);

        statementRef.update({ documentAgree: { agree: FieldValue.increment(agree), disagree: FieldValue.increment(disagree) } });
    } catch (error) {
        logger.error(error);
    }
}