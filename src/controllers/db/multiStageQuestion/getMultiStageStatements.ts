import { QuestionStage, Statement } from "delib-npm";
import { Dispatch } from "react";
import { isProduction } from "@/controllers/general/helpers";
import { setTempStatementsForPresentation } from "@/model/statements/statementsSlice";
import { store } from "@/model/store";

// export async function getMultiStageOptions(
// 	statement: Statement,

// ): Promise<void> {
// 	const dispatch: Dispatch<unknown> = store.dispatch;
// 	try {
       
// 		const urlBase = isProduction() ? "qeesi7aziq-uc.a.run.app" : "http://localhost:5001/synthesistalyaron/us-central1";

// 		if (statement.questionSettings?.currentStage === QuestionStage.suggestion) {
// 			const userId = store.getState().user.user?.uid;
// 			if (!userId) throw new Error("User not found");

// 			const url = isProduction() ? `https://getUserOptions-${urlBase}` : "http://localhost:5001/synthesistalyaron/us-central1/getUserOptions";

// 			const response = await fetch(
// 				`${url}?parentId=${statement.statementId}&userId=${userId}`
// 			);
// 			const { statements, error } = await response.json();
// 			if (error) throw new Error(error);

// 			dispatch(setTempStatementsForPresentation(statements));
// 		} else if (
// 			statement.questionSettings?.currentStage === QuestionStage.firstEvaluation
// 		) {
// 			const url = isProduction() ? `https://getRandomStatements-${urlBase}` : "http://localhost:5001/synthesistalyaron/us-central1/getRandomStatements";

// 			const response = await fetch(
// 				`${url}?parentId=${statement.statementId}&limit=6`
// 			);
// 			const { randomStatements, error } = await response.json();
// 			if (error) throw new Error(error);
// 			dispatch(setTempStatementsForPresentation(randomStatements));
// 		} else if (
// 			statement.questionSettings?.currentStage ===
//             QuestionStage.secondEvaluation
// 		) {
// 			const url = isProduction() ? `https://getTopStatements-${urlBase}` : "http://localhost:5001/synthesistalyaron/us-central1/getTopStatements";
// 			const response = await fetch(
// 				`${url}?parentId=${statement.statementId}&limit=6`
// 			);
// 			const { topSolutions, error } = await response.json();
// 			if (error) throw new Error(error);
// 			dispatch(setTempStatementsForPresentation(topSolutions));
// 		} else {
// 			dispatch(setTempStatementsForPresentation([]));
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		dispatch(setTempStatementsForPresentation([]));
// 	}
// }

export async function getFirstEvaluationOptions(
	statement: Statement,

): Promise<Statement[]> {

	try {
		const urlBase = isProduction() ? "qeesi7aziq-uc.a.run.app" : "http://localhost:5001/synthesistalyaron/us-central1";

		const url = isProduction() ? `https://getRandomStatements-${urlBase}` : "http://localhost:5001/synthesistalyaron/us-central1/getRandomStatements";

		const response = await fetch(
			`${url}?parentId=${statement.statementId}&limit=6`
		);
		const { randomStatements, error } = await response.json();
		if (error) throw new Error(error);

		randomStatements.forEach((s: Statement, i) => {
			s.order = i
		})
	
		return randomStatements as Statement[];
	} catch (error) {
		console.error(error);
		
		return [];
	}
}

export async function getSecondEvaluationOptions(statement: Statement): Promise<Statement[]> {

	try {
		const urlBase = isProduction() ? "qeesi7aziq-uc.a.run.app" : "http://localhost:5001/synthesistalyaron/us-central1";

		const url = isProduction() ? `https://getTopStatements-${urlBase}` : "http://localhost:5001/synthesistalyaron/us-central1/getTopStatements";
		const response = await fetch(
			`${url}?parentId=${statement.statementId}&limit=10`
		);
		const { topSolutions, error } = await response.json();
		if (error) throw new Error(error);

		topSolutions.forEach((s: Statement, i) => {
			s.order = i
		})
	
		return topSolutions as Statement[];
	} catch (error) {
		console.error(error);
		
		return [];
	}
}