import { Statement, StatementSchema } from "delib-npm";
import { z } from "zod";
import { isProduction } from "@/controllers/general/helpers";
import { setCurrentMultiStepOptions } from "@/model/statements/statementsSlice";
import { store } from "@/model/store";


export async function getFirstEvaluationOptions(
	statement: Statement,

): Promise<void> {

	try {
		
		const dispatch = store.dispatch;
		const urlBase = isProduction() ? "qeesi7aziq-uc.a.run.app" : "http://localhost:5001/synthesistalyaron/us-central1";

		const url = isProduction() ? `https://getRandomStatements-${urlBase}` : "http://localhost:5001/synthesistalyaron/us-central1/getRandomStatements";

		const response = await fetch(
			`${url}?parentId=${statement.statementId}&limit=6`
		);
		const { randomStatements, error } = await response.json();
		if (error) throw new Error(error);
		z.array(StatementSchema).parse(randomStatements);
		

		dispatch(setCurrentMultiStepOptions(randomStatements));


	} catch (error) {
		console.error(error);


	}
}

export async function getSecondEvaluationOptions(statement: Statement): Promise<void> {

	try {
		const dispatch = store.dispatch;
		const urlBase = isProduction() ? "qeesi7aziq-uc.a.run.app" : "http://localhost:5001/synthesistalyaron/us-central1";

		const url = isProduction() ? `https://getTopStatements-${urlBase}` : "http://localhost:5001/synthesistalyaron/us-central1/getTopStatements";
		const response = await fetch(
			`${url}?parentId=${statement.statementId}&limit=10`
		);
		const { topSolutions, error } = await response.json();
		if (error) throw new Error(error);

		z.array(StatementSchema).parse(topSolutions);
		dispatch(setCurrentMultiStepOptions(topSolutions));
	} catch (error) {
		console.error(error);

	}
}