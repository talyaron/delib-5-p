import { Collections, StageClass, Statement, StatementType } from "delib-npm";
import { db } from ".";

export async function createStagesForQuestionDocument(statement: Statement): Promise<void> {
	try {

		if (!statement.questionSettings?.isDocument) return;

		//check to see if the statement has stages
		const stagesDB = await db.collection(Collections.statements).where("parentId", "==", statement.statementId).where("statementType", "==", StatementType.stage).get()

		//if stages exists, don't create more stages
		if (stagesDB.docs.length > 0) return;

		//create stages for the question-document
		const _stages = new StageClass(statement);
		const stages: Statement[] = _stages.getBasicStages;

		//use batch to add all stages
		const batch = db.batch();
		stages.forEach((stage) => {
			const stageRef = db.collection(Collections.statements).doc(stage.statementId);
			batch.set(stageRef, stage, { merge: true });
		});

		await batch.commit();

		return;
	} catch (error) {
		console.error(error);
		return;

	}

}