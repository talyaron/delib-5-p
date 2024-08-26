import { Statement, Screen } from "delib-npm";

import {
	EnhancedEvaluationThumb,
	enhancedEvaluationsThumbs,
} from "./components/evaluation/enhancedEvaluation/EnhancedEvaluationModel";



export function sortSubStatements(
	subStatements: Statement[],
	sort: string | undefined,
	randomAgain = true,
	subStMap: Map<string, Statement> = new Map<string, Statement>(),
): { subStatements: Statement[], subStMap: Map<string, Statement> } {
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

		if(randomAgain){
			const ___subStatements = [];
			const stIds = subStMap.keys();
			for (const stId of stIds) {
				const statement = subStatements.find((st) => st.statementId === stId);
				if (statement) {
					___subStatements.push(statement);
				}
			}
			
			return { subStatements: ___subStatements, subStMap };
		}

		if (sort === Screen.OPTIONS_RANDOM || sort === Screen.QUESTIONS_RANDOM) {
			_subStatements.forEach((statement) => {
				subStMap.set(statement.statementId, statement);
			});
		}

		const __subStatements = _subStatements.map(
			(statement: Statement, i: number) => {
				const updatedStatement = Object.assign({}, statement);
				updatedStatement.order = i;

				return updatedStatement;
			},
		);

		return { subStatements: __subStatements, subStMap };
	} catch (error) {
		console.error(error);

		return { subStatements: subStatements, subStMap };
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