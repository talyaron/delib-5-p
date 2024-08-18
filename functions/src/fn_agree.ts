import { AgreeDisagree, AgreeDisagreeEnum, Collections } from "delib-npm";
import { logger } from "firebase-functions/v1";
import { db } from ".";
import { getAction } from "./fn_approval";
import { firestore } from "firebase-admin";
import { Change } from "firebase-functions";

export async function updateAgreement(event: Change<firestore.DocumentSnapshot>) {
    try {
      const agreeAfterData = event.after.data() as AgreeDisagree | undefined;
      const agreeBeforeData = event.before.data() as AgreeDisagree | undefined;
  
      if (!agreeAfterData && !agreeBeforeData) {
        throw new Error("No agreement data found");
      }
  
      const statementId = agreeAfterData?.statementId || agreeBeforeData?.statementId;
      if (!statementId) {
        throw new Error("Statement ID not found");
      }
  
      const statementRef = db.collection(Collections.statements).doc(statementId);
      const action = getAction(event);
  
      await updateStatementCounts(action, agreeBeforeData?.agree, agreeAfterData?.agree, statementRef);
  
    } catch (error) {
      logger.error('Error in updateAgreement:', error);
    }
  }
  
  
  
  async function updateStatementCounts(
    action: 'create' | 'delete' | 'update',
    agreeBefore: AgreeDisagreeEnum | undefined,
    agreeAfter: AgreeDisagreeEnum | undefined,
    statementRef: firestore.DocumentReference
  ) {
    const updates: { [key: string]: firestore.FieldValue } = {};
  
    switch (action) {
      case 'create':
        updateCountForAgreement(updates, agreeAfter, 1);
        break;
      case 'delete':
        updateCountForAgreement(updates, agreeBefore, -1);
        break;
      case 'update':
        if (agreeAfter !== agreeBefore) {
          if (agreeBefore !== AgreeDisagreeEnum.NoOpinion) {
            updateCountForAgreement(updates, agreeBefore, -1);
          }
          if (agreeAfter !== AgreeDisagreeEnum.NoOpinion) {
            updateCountForAgreement(updates, agreeAfter, 1);
          }
        }
        break;
    }
  
    if (Object.keys(updates).length > 0) {
      await statementRef.update(updates);
    }
  }
  
  function updateCountForAgreement(
    updates: { [key: string]: firestore.FieldValue },
    agreement: AgreeDisagreeEnum | undefined,
    increment: number
  ) {
    if (agreement === AgreeDisagreeEnum.Agree) {
      updates.documentAgree = firestore.FieldValue.increment(increment);
    } else if (agreement === AgreeDisagreeEnum.Disagree) {
      updates.documentDisagree = firestore.FieldValue.increment(increment);
    }
  }
