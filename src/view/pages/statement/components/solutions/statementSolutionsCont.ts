import { Statement, Screen, QuestionStage } from "delib-npm";

import {
	EnhancedEvaluationThumb,
	enhancedEvaluationsThumbs,
} from "./components/evaluation/enhancedEvaluation/EnhancedEvaluationModel";
import { setTempStatementsForPresentation } from "../../../../../model/statements/statementsSlice";
import { Dispatch } from "react";
import { store } from "../../../../../model/store";
import { isProduction } from "../../../../../controllers/general/helpers";

export function sortSubStatements(
	subStatements: Statement[],
	sort: string | undefined,
): Statement[] {
	try {
		let _subStatements = subStatements.map(
			(statement: Statement) => statement,
		);
		switch (sort) {
		case Screen.OPTIONS_CONSENSUS:
		case Screen.QUESTIONS_CONSENSUS:
			_subStatements = subStatements.sort(
				(a: Statement, b: Statement) => b.consensus - a.consensus,
			);
			break;
		case Screen.OPTIONS_NEW:
		case Screen.QUESTIONS_NEW:
			_subStatements = subStatements.sort(
				(a: Statement, b: Statement) => b.createdAt - a.createdAt,
			);
			break;
		case Screen.OPTIONS_RANDOM:
		case Screen.QUESTIONS_RANDOM:
			_subStatements = subStatements.sort(() => Math.random() - 0.5);
			break;
		case Screen.OPTIONS_UPDATED:
		case Screen.QUESTIONS_UPDATED:
			_subStatements = subStatements.sort(
				(a: Statement, b: Statement) => b.lastUpdate - a.lastUpdate,
			);
			break;
		}
		const __subStatements = _subStatements.map(
			(statement: Statement, i: number) => {
				const updatedStatement = Object.assign({}, statement);
				updatedStatement.order = i;

				return updatedStatement;
			},
		);

		return __subStatements;
	} catch (error) {
		console.error(error);

		return subStatements;
	}
}

const defaultThumb = enhancedEvaluationsThumbs[2];

export const getEvaluationThumbIdByScore = (
	evaluationScore: number | undefined,
): string => {
	if (evaluationScore === undefined) return defaultThumb.id;

	// find the nearest evaluation
	let nearestThumb = enhancedEvaluationsThumbs[0];

	enhancedEvaluationsThumbs.forEach((evaluationThumb) => {
		const current = Math.abs(evaluationScore - evaluationThumb.evaluation);
		const nearest = Math.abs(evaluationScore - nearestThumb.evaluation);

		if (current < nearest) {
			nearestThumb = evaluationThumb;
		}
	});

	return nearestThumb.id;
};

interface GetEvaluationThumbsParams {
	evaluationScore: number | undefined;
	isEvaluationPanelOpen: boolean;
}

export const getEvaluationThumbsToDisplay = ({
	evaluationScore,
	isEvaluationPanelOpen,
}: GetEvaluationThumbsParams): EnhancedEvaluationThumb[] => {
	if (isEvaluationPanelOpen) {
		return enhancedEvaluationsThumbs;
	}

	if (evaluationScore === undefined) {
		const firstAndLastThumbs = [
			enhancedEvaluationsThumbs[0],
			enhancedEvaluationsThumbs[enhancedEvaluationsThumbs.length - 1],
		];

		return firstAndLastThumbs;
	}

	const selectedThumbId = getEvaluationThumbIdByScore(evaluationScore);
	const selectedThumb = enhancedEvaluationsThumbs.find(
		(evaluationThumb) => evaluationThumb.id === selectedThumbId,
	);

	return [selectedThumb || defaultThumb];
};

export async function getMultiStageOptions(
	statement: Statement,
	dispatch: Dispatch<unknown>,
): Promise<void> {
	try {
		const urlBase = isProduction()? "qeesi7aziq-uc.a.run.app" : "http://localhost:5001/synthesistalyaron/us-central1";
		
		if (statement.questionSettings?.currentStage === QuestionStage.suggestion) {
			const userId = store.getState().user.user?.uid;
			if(!userId) throw new Error("User not found");
		
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
				`https://getTopStatements-${urlBase}?parentId=${statement.statementId}&limit=10`
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



