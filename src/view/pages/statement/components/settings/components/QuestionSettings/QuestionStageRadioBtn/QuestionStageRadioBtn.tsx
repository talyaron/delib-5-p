import { FC } from "react";
import "./QuestionStageRadioBtn.scss";
import { QuestionStage, Statement } from "delib-npm";

import LightBulbIcon from "@/assets/icons/lightBulbIcon.svg?react";
import ArrowUp from "@/assets/icons/arrowUpIcon.svg?react";
import EvaluationsIcon from "@/assets/icons/evaluations2Icon.svg?react";
import HandIcon from "@/assets/icons/handIcon.svg?react";
import FlagIcon from "@/assets/icons/flagIcon.svg?react";
import { setQuestionStage } from "@/controllers/db/statements/statementMetaData/setStatementMetaData";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { statementMetaDataSelector } from "@/model/statements/statementsMetaSlice";

interface Props {
  stage: QuestionStage;
  statement: Statement;
}

const QuestionStageRadioBtn: FC<Props> = ({ stage, statement }) => {
	const { t } = useLanguage();
	const isSelected = statement.questionSettings?.currentStage === stage;
	const { backgroundColor, btnBackgroundColor } = getStageInfo(
		stage,
		isSelected
	);
	const stageInfo = getStagesInfo(stage);
	const numberOfEvaluators = useAppSelector(statementMetaDataSelector(statement.statementId))?.numberOfEvaluators || 0;
	
	return (
		<div
			className="question-stage-radio-btn"
			style={{ transform: isSelected ? "scale(1.04)" : "scale(1)" }}
		>
			<div
				className="question-stage-radio-btn__top"
				style={{
					backgroundColor: backgroundColor,
					opacity: isSelected ? 1 : 0.5,
				}}
			>
				{stageInfo ? stageInfo.icon : <LightBulbIcon className="img" />}
				{stage === QuestionStage.suggestion &&<div className="number">{numberOfEvaluators}</div>}
			</div>
			<button
				className="question-stage-radio-btn__radio"
				onClick={() => {
					setQuestionStage({ statementId: statement.statementId, stage });
				}}
			>
				<div
					className="radio-button"
					style={{ backgroundColor: btnBackgroundColor }}
				>
					<input
						type="radio"
						name="question-stage"
						id={`question-stage-${stage}`}
					/>
					<div className="radio-button__inner"></div>
				</div>
				{t(stageInfo ? stageInfo.name : stage)}
			</button>
		</div>
	);
};

export default QuestionStageRadioBtn;

export function getStageInfo(stage: QuestionStage, isSelected = true):{ backgroundColor: string; btnBackgroundColor: string; stageInfo:StageInfo|undefined; error?: boolean } {
	try {
		const stageInfo:StageInfo|undefined = getStagesInfo(stage);
		if(!stageInfo) throw new Error("Stage info not found");

		const backgroundColor = stageInfo
			? `var(${stageInfo.color})`
			: "var(--green)";
		const btnBackgroundColor = stageInfo
			? isSelected
				? `var(${stageInfo.color})`
				: "#DCE7FF"
			: "#DCE7FF";
		
		return { backgroundColor, btnBackgroundColor, stageInfo };
	} catch (error) {
		console.error(error);
		
		return {
			backgroundColor: "var(--green)",
			btnBackgroundColor: "#DCE7FF",
			stageInfo: undefined,
			error: true,
		};
	}
}

export interface StageInfo {
	name: string;
	icon: JSX.Element;
	color: string;
	message: string | undefined;
}

export function getStagesInfo( questionStage: QuestionStage | undefined):StageInfo|undefined {
	try {
		const stages = {
			[QuestionStage.explanation]: {
				name: "Explanation",
				icon: <LightBulbIcon className="img" />,
				color: "--green",
				message: undefined,
			},
			[QuestionStage.suggestion]: {
				name: "Suggestions",
				icon: <LightBulbIcon className="img" />,
				color: "--settings-suggestions",
				message: "Please suggest a solution to the question",
			},
			[QuestionStage.firstEvaluation]: {
				name: "First Evaluation",
				icon: <EvaluationsIcon className="img" />,
				color: "--settings-first-evaluation",
				message: `Please evaluate each solution in the next set of solutions. For each solution, indicate your rating using the smiley (positive) or frown (negative) icons`,
			},
			[QuestionStage.secondEvaluation]: {
				name: "Second Evaluation",
				icon: <ArrowUp className="img" />,
				color: "--settings-second-evaluation",
				message: "Please evaluate the top solutions",
			},
			[QuestionStage.voting]: {
				name: "Voting",
				icon: <HandIcon className="img" />,
				color: "--settings-voting",
				message: "Please chose your preferred solution",
			},
			[QuestionStage.finished]: {
				name: "Finished",
				icon: <FlagIcon className="img" />,
				color: "--settings-finished",
				message: "The voting process for this question has concluded",
			},
		};

		if (questionStage) {
			return stages[questionStage];
		}
		
		return undefined;
	} catch (error) {
		console.error(error);
		
		return undefined;
	}
}
