import { FieldValue } from "firebase-admin/firestore";
import { db } from "./index";
import { logger } from "firebase-functions/v1";

export enum SignatureStatus {
    signed = "signed",
    unsigned = "unsigned",
    rejected = "rejected",
}

export async function addSignature(event: any) {
    try {
        const signature = event.data.data();
        if (!signature) throw new Error("signature is not defined");
        if (signature.statementId === undefined)
            throw new Error("statementId is not defined");

        const statementRef = db
            .collection("statements")
            .doc(signature.statementId);
        await statementRef.update({ signaturesCount: FieldValue.increment(1) });
    } catch (error) {
        logger.error(error);
    }
}

export async function removeSignature(event: any) {
    try {
        const signature = event.data.data();
        if (!signature) throw new Error("signature is not defined");
        if (signature.statementId === undefined)
            throw new Error("statementId is not defined");

        const statementRef = db
            .collection("statements")
            .doc(signature.statementId);
        await statementRef.update({
            signaturesCount: FieldValue.increment(-1),
        });
    } catch (error) {
        logger.error(error);
    }
}
