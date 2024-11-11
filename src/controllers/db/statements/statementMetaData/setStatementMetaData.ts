import {
	Collections,
	QuestionSettings,
	QuestionStage,
	QuestionType,
} from 'delib-npm';
import { doc, updateDoc } from 'firebase/firestore';
import { FireStore } from '@/controllers/db/config';

interface SetStatementStageParams {
	statementId: string;
	stage: QuestionStage;
}
export async function setQuestionStage({
	statementId,
	stage = QuestionStage.suggestion,
}: SetStatementStageParams) {
	try {
		if (!statementId) throw new Error('Statement ID is undefined');
		const statementRef = doc(FireStore, Collections.statements, statementId);
		const questionSettings: QuestionSettings = {
			currentStage: stage,
			questionType: QuestionType.multipleSteps,
		};
		await updateDoc(statementRef, { questionSettings });
	} catch (error) {
		console.error(error);
	}
}

interface SetStatementTypeProps {
	statementId: string;
	type: QuestionType;
	stage: QuestionStage;
}

export async function setQuestionType({
	statementId,
	type = QuestionType.singleStep,
	stage = QuestionStage.suggestion,
}: SetStatementTypeProps) {
	try {
		if (!statementId) throw new Error('Statement ID is undefined');
		const statementRef = doc(FireStore, Collections.statements, statementId);
		const questionSettings: QuestionSettings = {
			currentStage: stage,
			questionType: type,
		};
		await updateDoc(statementRef, { questionSettings });
	} catch (error) {
		console.error(error);
	}
}
