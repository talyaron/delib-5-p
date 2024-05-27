import { z } from "zod";
import { Timestamp, doc, setDoc } from "@firebase/firestore";
import { Statement, Collections } from "delib-npm";
import { DB } from "../config";
import { store } from "../../../model/store";

export async function setEvaluationToDB(
	statement: Statement,
	evaluation: number,
): Promise<void> {
	try {
		z.number().parse(evaluation);
		if (evaluation < -1 || evaluation > 1)
			throw new Error("Evaluation is not in range");

		//ids
		const parentId = statement.parentId;
		if (!parentId) throw new Error("ParentId is undefined");

		const statementId = statement.statementId;
		const user = store.getState().user.user;

		const userId = user?.uid;
		if (!userId) throw new Error("User is undefined");
		const evaluationId = `${userId}--${statementId}`;

		//set evaluation to db

		const evaluationRef = doc(DB, Collections.evaluations, evaluationId);
		await setDoc(evaluationRef, {
			parentId,
			evaluationId,
			statementId,
			evaluatorId: userId,
			updatedAt: Timestamp.now().toMillis(),
			evaluation,
			evaluator: user,
		});
	} catch (error) {
		console.error(error);
	}
}
