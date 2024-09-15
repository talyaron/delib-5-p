import { doc, setDoc } from "firebase/firestore";
import { z } from "zod";
import { DB } from "../config";
import { Collections, ResultsBy } from "delib-npm";

export async function updateResultsSettings(
	statementId: string,
	resultsBy: ResultsBy = ResultsBy.topOptions,
	numberOfResults = 3,
) {
	try {
		z.string().parse(statementId);
		z.number().parse(numberOfResults);
		z.nativeEnum(ResultsBy).parse(resultsBy);

		const statementRef = doc(DB, Collections.statements, statementId);

		const results = {
			numberOfResults,
			resultsBy,
		};

		
		await setDoc(statementRef, { results }, { merge: true });
	} catch (error) {
		console.error(error);
	}
}
