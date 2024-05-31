import { Collections, QuestionStage } from "delib-npm";
import {  doc, setDoc } from "firebase/firestore";
import { DB } from "../../config";

interface SetStatementStageParams {
	statementId: string;
	stage: QuestionStage;
}
export async function setQuestionStage({ statementId, stage = QuestionStage.suggestion }: SetStatementStageParams) {
	try {
		if (!statementId) throw new Error("Statement ID is undefined");
		const statementRef = doc(DB, Collections.statementsMetaData, statementId);
		await setDoc(statementRef, { statementId, currentStage: stage, lastUpdate: new Date().getTime() });
	} catch (error) {
		console.error(error);
	}
}