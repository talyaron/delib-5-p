import { FieldValue } from "firebase-admin/firestore";
import { db } from "./index";
import { logger } from "firebase-functions/v1";
import { getAction } from "./fn_approval";
import { Collections, DocumentSigns, Signature } from "delib-npm";

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


//functions for FreeDi Sign

export function updateDocumentSignatures(ev: any) {
    try {

        const action = getAction(ev);
        const signatureAfterData = ev.data.after.data() as Signature;
        const signatureBeforeData = ev.data.before.data() as Signature;
        const signatureData = signatureAfterData || signatureBeforeData;


        switch (action) {
            case "create":
                onCreateSignature(signatureData);
                break;
            case "delete":
                onDeleteSignature(signatureData);
                break;
            case "update":
                onUpdateSignature(signatureBeforeData, signatureAfterData);
                break;
            default:
                break;
        }

    } catch (error) {
        logger.error(error);
    }
}

async function onCreateSignature(signature: Signature) {
    try {
        const { documentId, signed, levelOfSignature } = signature;

        await db.runTransaction(async (transaction) => {
            const documentSignatureRef = db.collection(Collections.documentsSigns)
                .doc(documentId)

            const documentSignatureDB = await transaction.get(documentSignatureRef);
            if (!documentSignatureDB.exists) {
                const documentSignature: DocumentSigns = {
                    documentId, viewed: 1,
                    signed: signed ? 1 : 0,
                    rejected: signed ? 0 : 1,
                    avgSignatures: signed ? levelOfSignature : 0,
                    totalSignaturesLevel:signed ? levelOfSignature : 0
                };
                transaction.set(documentSignatureRef, documentSignature);
            } else {
                const documentSignature = documentSignatureDB.data() as DocumentSigns;
                documentSignature.viewed += 1;
                documentSignature.signed += signed ? 1 : 0;
                documentSignature.rejected += signed ? 0 : 1;
                documentSignature.totalSignaturesLevel += signed ? levelOfSignature : 0;
                documentSignature.avgSignatures = documentSignature.totalSignaturesLevel/documentSignature.viewed;
                transaction.update(documentSignatureRef, documentSignature);

            }
        });

    } catch (error) {
        logger.error(error);
    }
}

async function onDeleteSignature(signature: Signature) {
    try {
        const { documentId, signed, levelOfSignature } = signature;

        await db.runTransaction(async (transaction) => {
            const documentSignatureRef = db.collection(Collections.documentsSigns)
                .doc(documentId)

            const documentSignatureDB = await transaction.get(documentSignatureRef);
            if (documentSignatureDB.exists) {
                const documentSignature = documentSignatureDB.data() as DocumentSigns;
                documentSignature.viewed -= 1;
                documentSignature.signed -= signed ? 1 : 0;
                documentSignature.rejected -= signed ? 0 : 1;
                documentSignature.totalSignaturesLevel -= signed ? levelOfSignature : 0;
                documentSignature.avgSignatures = documentSignature.totalSignaturesLevel/documentSignature.viewed;
                transaction.update(documentSignatureRef, documentSignature);
            }
        });

    } catch (error) {
        logger.error(error);
    }
}

async function onUpdateSignature(signatureBeforeData: Signature, signatureAfterData: Signature) {
    try {
        const { levelOfSignature: levelOfSignatureBefore } = signatureBeforeData;
        const { documentId, signed, levelOfSignature: levelOfSignatureAfter } = signatureAfterData;
     


        await db.runTransaction(async (transaction) => {
            const documentSignatureRef = db.collection(Collections.documentsSigns)
                .doc(documentId)

            const documentSignatureDB = await transaction.get(documentSignatureRef);
            if (documentSignatureDB.exists) {
                const documentSignature = documentSignatureDB.data() as DocumentSigns;
                documentSignature.signed += signed ? 1 : -1;
                documentSignature.rejected += signed ? -1 : 1;
                documentSignature.totalSignaturesLevel += signed ? levelOfSignatureAfter : -levelOfSignatureBefore;
                documentSignature.avgSignatures = documentSignature.totalSignaturesLevel/documentSignature.viewed;
                transaction.update(documentSignatureRef, documentSignature);
            } else {

                const documentSignature: DocumentSigns = {
                    documentId, viewed: 1,
                    signed: signed ? 1 : 0,
                    rejected: signed ? 0 : 1,
                    avgSignatures: signed ? levelOfSignatureAfter : 0,
                    totalSignaturesLevel:signed ? levelOfSignatureAfter : 0
                };
                transaction.set(documentSignatureRef, documentSignature);
            }
        });

    } catch (error) {
        logger.error(error);
    }
}
