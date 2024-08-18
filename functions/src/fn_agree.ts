import { AgreeDisagree, AgreeDisagreeEnum, Collections } from "delib-npm";
import { logger } from "firebase-functions/v1";
import { db } from ".";
import { getAction } from "./fn_approval";
import { FieldValue } from "firebase-admin/firestore";

export async function updateAgreement(event: any) {
    try {
        const agreeAfterData = event.data.after.data() as AgreeDisagree | undefined;
        const agreeBeforeData = event.data.before.data() as AgreeDisagree | undefined;
        const combinedAgreement = { ...agreeAfterData, ...agreeBeforeData } as AgreeDisagree;
        if (!combinedAgreement) throw new Error("No agreement data found");

        const statementRef = db.collection(Collections.statements).doc(combinedAgreement.statementId);
        const action = getAction(event);

        if (action === "create") {
            if (!agreeAfterData) throw new Error("No agreement data found");
            const { agree } = agreeAfterData;

            if (agree === AgreeDisagreeEnum.Agree) {
                await statementRef.update({ documentAgree: { agree: FieldValue.increment(1) } });
            } else if (agree === AgreeDisagreeEnum.Disagree) {
                await statementRef.update({ documentDisagree: { disagree: FieldValue.increment(1) } });
            }
        } else if (action === "delete") {
            if (!agreeBeforeData) throw new Error("No agreement data found");
            const { agree } = agreeBeforeData;

            if (agree === AgreeDisagreeEnum.Agree) {
                await statementRef.update({ documentAgree: { agree: FieldValue.increment(-1) } });
            } else if (agree === AgreeDisagreeEnum.Disagree) {
                await statementRef.update({ documentDisagree: { disagree: FieldValue.increment(-1) } });
            }
        } else if (action === "update") {
            if (!agreeAfterData) throw new Error("No agreement data found");
            const { agree: agreeAfter } = agreeAfterData;
            const { agree: agreeBefore } = agreeBeforeData || { agree: undefined };
            if (agreeAfter === agreeBefore) return;

            if (agreeAfter === AgreeDisagreeEnum.Agree && agreeBefore === AgreeDisagreeEnum.Disagree) {
                await statementRef.update({ documentAgree: { agree: FieldValue.increment(1) } });
                await statementRef.update({ documentDisagree: { disagree: FieldValue.increment(-1) } });
            } else if (agreeAfter === AgreeDisagreeEnum.Disagree && agreeBefore === AgreeDisagreeEnum.Agree) {
                await statementRef.update({ documentAgree: { agree: FieldValue.increment(-1) } });
                await statementRef.update({ documentDisagree: { disagree: FieldValue.increment(1) } });
            } else if (agreeBefore === AgreeDisagreeEnum.NoOpinion) {
                if (agreeAfter === AgreeDisagreeEnum.Agree) {
                    await statementRef.update({ documentAgree: { agree: FieldValue.increment(1) } });
                } else if (agreeAfter === AgreeDisagreeEnum.Disagree) {
                    await statementRef.update({ documentDisagree: { disagree: FieldValue.increment(1) } });
                }
            } else if (agreeAfter === AgreeDisagreeEnum.NoOpinion) {
                if (agreeBefore === AgreeDisagreeEnum.Agree) {
                    await statementRef.update({ documentAgree: { agree: FieldValue.increment(-1) } });
                } else if (agreeBefore === AgreeDisagreeEnum.Disagree) {
                    await statementRef.update({ documentDisagree: { disagree: FieldValue.increment(-1) } });
                }
            }


        }


    } catch (error) {
        logger.error(error);
    }
}