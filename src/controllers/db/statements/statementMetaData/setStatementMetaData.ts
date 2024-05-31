import { Collections, QuestionStage, QuestionType } from "delib-npm";
import { doc, updateDoc } from "firebase/firestore";
import { DB } from "../../config";

interface SetStatementStageParams {
	statementId: string;
	stage: QuestionStage;
}
export async function setQuestionStage({ statementId, stage = QuestionStage.suggestion }: SetStatementStageParams) {
	try {
		if (!statementId) throw new Error("Statement ID is undefined");
		const statementRef = doc(DB, Collections.statements, statementId);
		await updateDoc(statementRef, { questionSettings: {  currentStage: stage,questionType:QuestionType.singleStep  } });
	} catch (error) {
		console.error(error);
	}
}