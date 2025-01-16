import { Collections, StageClass, Statement, StatementType } from "delib-npm";
import { db } from ".";

export async function createStagesForQuestionDocument(statementId: string): Promise<void> {
	try {
		if (!statementId) throw new Error('No statementId provided');

		// check to see if the statement has stages
		const stagesDB = await db
			.collection(Collections.statements)
			.where("parentId", "==", statementId)
			.where("statementType", "==", StatementType.stage)
			.get()

		// if stages exists, don't create more stages
		if (stagesDB.docs.length > 0) return;

		//create stages for the question-document
		const statement = (await db.collection(Collections.statements).doc(statementId).get()).data() as Statement | undefined;
		if (!statement) throw new Error('No statement found');
		const stages: Statement[] = new StageClass().basicStages(statement);


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