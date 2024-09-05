import { Statement, Screen } from "delib-npm";

import {
	EnhancedEvaluationThumb,
	enhancedEvaluationsThumbs,
} from "./components/evaluation/enhancedEvaluation/EnhancedEvaluationModel";
import { store } from "@/model/store";
import { updateStatementTop } from "@/model/statements/statementsSlice";



export function sortSubStatements(
	subStatements: Statement[],
	sort: string | undefined,
	gap = 30
): {totalHeight:number} {
	try {
		const dispatch = store.dispatch;
		let _subStatements = [...subStatements];
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
		
		let totalHeight = gap;
		const updates: { statementId: string; top: number }[] = _subStatements.map((subStatement) => {
			try {
				const update = {
					statementId: subStatement.statementId,
					top: totalHeight,
				};
				totalHeight += (subStatement.elementHight || 0) + gap;
				
				return update;

			} catch (error) {
				console.error(error);
			}
		}).filter((update) => update !== undefined) as { statementId: string; top: number }[];
		dispatch(updateStatementTop(updates));

		return {totalHeight}
	} catch (error) {
		console.error(error);
		
		return {totalHeight:0};

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



