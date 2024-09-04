import { Statement, Screen, isOptionFn, QuestionType, StatementType, QuestionStage } from "delib-npm";

import {
	EnhancedEvaluationThumb,
	enhancedEvaluationsThumbs,
} from "./components/evaluation/enhancedEvaluation/EnhancedEvaluationModel";
import { getFirstEvaluationOptions, getSecondEvaluationOptions } from "@/controllers/db/multiStageQuestion/getMultiStageStatements";
import { store } from "@/model/store";
import { updateStatementTop } from "@/model/statements/statementsSlice";



export function sortSubStatements(
	subStatements: Statement[],
	sort: string | undefined,
	gap:number = 30
): void {
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


	} catch (error) {
		console.error(error);


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

interface GetSubStatementsProps {
	statement: Statement;
	subStatements: Statement[];
	sort: string | undefined;
	questions: boolean;
	myStatements: Statement[];
}
export async function getSubStatements({ statement, subStatements, sort, questions, myStatements }: GetSubStatementsProps): Promise<Statement[]> {
	try {

		if (!statement) return [];
		if (!subStatements) return [];
		const _subStatements = [...subStatements];

		const isMultiStage = statement.questionSettings?.questionType === QuestionType.multipleSteps;

		if (!isMultiStage) {
			return getSortedStatements(_subStatements, sort, questions);
		} else {

			switch (statement.questionSettings?.currentStage) {
				case QuestionStage.explanation:
					return ([]);
				case QuestionStage.suggestion:
					return myStatements;
				case QuestionStage.firstEvaluation:
					const firstSt = await getFirstEvaluationOptions(statement);
					return getSortedStatements(firstSt, sort, questions);
				case QuestionStage.secondEvaluation:
					const secondSt = await getSecondEvaluationOptions(statement);
					return getSortedStatements(secondSt, sort, questions);
				case QuestionStage.voting:

					return ([]);
				default:
					return ([]);
			}
		}


	} catch (error) {
		console.error(error);
		return [];
	}
}

function getSortedStatements(_subStatements: Statement[], sort: string | undefined, questions: boolean) {
	return sortSubStatements(
		_subStatements,
		sort
	).filter((subStatement) => {
		//if questions is true, only show questions
		if (questions) {
			return subStatement.statementType === StatementType.question;
		}
		//if options is true, only show options
		return isOptionFn(subStatement);
	});
}
