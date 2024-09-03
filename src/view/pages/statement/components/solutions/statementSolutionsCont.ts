import { Statement, Screen, isOptionFn, QuestionType, StatementType, QuestionStage } from "delib-npm";

import {
	EnhancedEvaluationThumb,
	enhancedEvaluationsThumbs,
} from "./components/evaluation/enhancedEvaluation/EnhancedEvaluationModel";
import { getFirstEvaluationOptions, getSecondEvaluationOptions } from "@/controllers/db/multiStageQuestion/getMultiStageStatements";



export function sortSubStatements(
	subStatements: Statement[],
	sort: string | undefined,
): Statement[] {
	try {
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

interface GetSubStatementsProps {
	statement: Statement;
	subStatements: Statement[];
	sort: string | undefined;
	questions: boolean;
	myStatements: Statement[];
	setSortedSubStatements: React.Dispatch<Statement[]>;
}
export async function getSubStatements({ statement, subStatements, sort, questions, myStatements, setSortedSubStatements }: GetSubStatementsProps): Promise<void> {
	try {
		console.log("getSubStatements")
		if (!statement) return;
		if (!subStatements) return;
		const _subStatements = [...subStatements];

		const isMultiStage = statement.questionSettings?.questionType === QuestionType.multipleSteps;

		if (!isMultiStage) {
			const st = getSortedStatements(_subStatements, sort, questions);
			console.log("single stage");
			setSortedSubStatements(st);
		} else {
			console.log("multi steps")
			switch (statement.questionSettings?.currentStage) {
				case QuestionStage.explanation:
					setSortedSubStatements([]);
					return;
				case QuestionStage.suggestion:
					setSortedSubStatements(myStatements);
					return;
				case QuestionStage.firstEvaluation:
					getFirstEvaluationOptions(statement).then((subStatements) => {
						// const st = getSortedStatements(subStatements, sort, questions);
						setSortedSubStatements(subStatements);
					})

					return;
				case QuestionStage.secondEvaluation:
					getSecondEvaluationOptions(statement).then((subStatements) => {
						const st = getSortedStatements(subStatements, sort, questions);
						setSortedSubStatements(st);
					})
					return;
				case QuestionStage.voting:
					setSortedSubStatements([]);
					return;
				default:
					console.log("default ")
					setSortedSubStatements([]);
					return;
			}
		}
		return;

	} catch (error) {
		console.error(error);

	}
}

function getSortedStatements(_subStatements:Statement[], sort: string | undefined, questions: boolean) {
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
