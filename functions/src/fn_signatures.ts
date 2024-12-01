import { db } from "./index";
import { logger } from "firebase-functions/v1";
import { getAction } from "./fn_approval";
import { Collections, DocumentSigns, Signature, SignatureType } from "delib-npm";

//functions for FreeDi Sign
//TODO: deploy this function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		const { documentId, signed, levelOfSignature } = signature as Signature;

		await db.runTransaction(async (transaction) => {
			const documentSignatureRef = db.collection(Collections.documentsSigns)
				.doc(documentId)

			const documentSignatureDB = await transaction.get(documentSignatureRef);
			if (!documentSignatureDB.exists) {
				//in case the document signature do not exists yet
				const documentSignature: DocumentSigns = {
					documentId,
					viewed: 1,
					signed: signed === SignatureType.signed ? 1 : 0,
					rejected: signed === SignatureType.rejected ? 1 : 0,
					avgSignatures: signed === SignatureType.signed ? levelOfSignature : 0,
					totalSignaturesLevel: signed === SignatureType.signed ? levelOfSignature : 0
				};
				transaction.set(documentSignatureRef, documentSignature);
			} else {
				const documentSignature = documentSignatureDB.data() as DocumentSigns;
				const sumSignedAndRejected = documentSignature.signed + documentSignature.rejected;

				documentSignature.viewed += 1;
				documentSignature.signed += signed === SignatureType.signed ? 1 : 0;
				documentSignature.rejected += signed === SignatureType.rejected ? 1 : 0;
				documentSignature.totalSignaturesLevel += signed === SignatureType.signed ? levelOfSignature : 0;
				documentSignature.avgSignatures = sumSignedAndRejected > 0 ? documentSignature.totalSignaturesLevel / sumSignedAndRejected : 0;
				transaction.update(documentSignatureRef, documentSignature);

			}
		});

	} catch (error) {
		logger.error(error);
	}
}

async function onDeleteSignature(signature: Signature) {
	try {
		const { documentId, signed, levelOfSignature } = signature as Signature;

		await db.runTransaction(async (transaction) => {
			const documentSignatureRef = db.collection(Collections.documentsSigns)
				.doc(documentId)

			const documentSignatureDB = await transaction.get(documentSignatureRef);
			if (documentSignatureDB.exists) {
				const documentSignature = documentSignatureDB.data() as DocumentSigns;
				documentSignature.viewed -= 1;
				documentSignature.signed -= signed === SignatureType.signed ? 1 : 0;
				documentSignature.rejected -= signed === SignatureType.rejected ? 0 : 1;
				documentSignature.totalSignaturesLevel -= signed === SignatureType.signed ? levelOfSignature : 0;
				documentSignature.avgSignatures = documentSignature.totalSignaturesLevel / documentSignature.viewed;
				transaction.update(documentSignatureRef, documentSignature);
			}
		});

	} catch (error) {
		logger.error(error);
	}
}

async function onUpdateSignature(signatureBeforeData: Signature, signatureAfterData: Signature) {
	try {
		const { signed: signedBefore, levelOfSignature: levelOfSignatureBefore } = signatureBeforeData;
		const { documentId, signed: signedAfter, levelOfSignature: levelOfSignatureAfter } = signatureAfterData;

		const diffSigned = (signedAfter === SignatureType.signed ? 1 : 0) - (signedBefore === SignatureType.signed ? 1 : 0);
		const diffRejected = (signedAfter === SignatureType.rejected ? 1 : 0) - (signedBefore === SignatureType.rejected ? 1 : 0);
		
		const diffSignatureLevel = levelOfSignatureAfter - levelOfSignatureBefore;

		await db.runTransaction(async (transaction) => {
			const documentSignatureRef = db.collection(Collections.documentsSigns)
				.doc(documentId)

			const documentSignatureDB = await transaction.get(documentSignatureRef);
			if (!documentSignatureDB.exists) throw new Error("Document signature not found");

			const documentSignature = documentSignatureDB.data() as DocumentSigns;

			const sumApprovedAndRejected = documentSignature.signed + documentSignature.rejected;
			documentSignature.signed += diffSigned;
			documentSignature.rejected += diffRejected;
			documentSignature.totalSignaturesLevel += diffSignatureLevel;
			documentSignature.avgSignatures = sumApprovedAndRejected > 0 ? (documentSignature.totalSignaturesLevel) / (documentSignature.signed + documentSignature.rejected ) : 0;

			transaction.update(documentSignatureRef, documentSignature);

		});

	} catch (error) {
		logger.error(error);
	}
}
