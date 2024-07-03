import { QuestionStage, Statement } from "delib-npm";
import { Dispatch } from "react";
import { isProduction } from "../../general/helpers";
import { setTempStatementsForPresentation } from "../../../model/statements/statementsSlice";
import { store } from "../../../model/store";

export async function getMultiStageOptions(
	statement: Statement,

): Promise<void> {
	const dispatch: Dispatch<any> = store.dispatch;
	try {
		console.log("isProduction", isProduction());
		const urlBase = isProduction() ? "qeesi7aziq-uc.a.run.app" : "http://localhost:5001/synthesistalyaron/us-central1";

		if (statement.questionSettings?.currentStage === QuestionStage.suggestion) {
			const userId = store.getState().user.user?.uid;
			if (!userId) throw new Error("User not found");

			const response = await fetch(
				`https://getUserOptions-${urlBase}?parentId=${statement.statementId}&userId=${userId}`
			);
			const { statements, error } = await response.json();
			if (error) throw new Error(error);

			dispatch(setTempStatementsForPresentation(statements));
		} else if (
			statement.questionSettings?.currentStage === QuestionStage.firstEvaluation
		) {
			const response = await fetch(
				`https://getrandomstatements-${urlBase}?parentId=${statement.statementId}&limit=6`
			);
			const { randomStatements, error } = await response.json();
			if (error) throw new Error(error);
			dispatch(setTempStatementsForPresentation(randomStatements));
		} else if (
			statement.questionSettings?.currentStage ===
			QuestionStage.secondEvaluation
		) {
			const response = await fetch(
				`https://getTopStatements-${urlBase}?parentId=${statement.statementId}&limit=6`
			);
			const { topSolutions, error } = await response.json();
			if (error) throw new Error(error);
			dispatch(setTempStatementsForPresentation(topSolutions));
		} else {
			dispatch(setTempStatementsForPresentation([]));
		}
	} catch (error) {
		console.error(error);
		dispatch(setTempStatementsForPresentation([]));
	}
}