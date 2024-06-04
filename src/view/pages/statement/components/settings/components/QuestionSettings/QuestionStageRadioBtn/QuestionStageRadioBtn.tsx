import { FC } from "react";
import "./QuestionStageRadioBtn.scss";
import { QuestionStage, Statement } from "delib-npm";

import LightBulbIcon from "../../../../../../../../assets/icons/lightBulbIcon.svg?react";
import ArrowUp from "../../../../../../../../assets/icons/arrowUpIcon.svg?react";
import EvaluationsIcon from "../../../../../../../../assets/icons/evaluations2Icon.svg?react";
import HandIcon from "../../../../../../../../assets/icons/handIcon.svg?react";
import FlagIcon from "../../../../../../../../assets/icons/flagIcon.svg?react";
import { setQuestionStage } from "../../../../../../../../controllers/db/statements/statementMetaData/setStatementMetaData";
import { useLanguage } from "../../../../../../../../controllers/hooks/useLanguages";


interface Props {
  stage: QuestionStage;
  statement: Statement;
}



export const stages = {
  [QuestionStage.explanation]: {
    name: "Explanation",
    icon: <LightBulbIcon className="img" />,
    color: "--green",
    message:undefined
  },
  [QuestionStage.suggestion]: {
    name: "Suggestions",
    icon: <LightBulbIcon className="img" />,
    color: "--settings-suggestions",
    message:"Please suggest a solution"
  },
  [QuestionStage.firstEvaluation]: {
    name: "First Evaluation",
    icon: <EvaluationsIcon className="img" />,
    color: "--settings-first-evaluation",
    message:"Please Evaluate each set of 10 proposed solutions that are provided to you"
  },
  [QuestionStage.secondEvaluation]: {
    name: "Second Evaluation",
    icon: <ArrowUp className="img" />,
    color: "--settings-second-evaluation",
    message:"Please evaluate the top solutions that are presented to you",
  },
  [QuestionStage.voting]: {
    name: "Voting",
    icon: <HandIcon className="img" />,
    color: "--settings-voting",
    message:"Please vote on the top solutions that are presented to you",
  },
  [QuestionStage.finished]: {
    name: "Finished",
    icon: <FlagIcon className="img" />,
    color: "--settings-finished",
    message:"The voting process for this question has concluded",
  },
};

const QuestionStageRadioBtn: FC<Props> = ({ stage, statement }) => {
  const {t} = useLanguage();
  const isSelected = statement.questionSettings?.currentStage === stage;
  const { backgroundColor, btnBackgroundColor } = getStageInfo(stage, isSelected);

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
        {stages[stage] ? stages[stage].icon : <LightBulbIcon className="img" />}
        <div className="number">324</div>
      </div>
      <div
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
        {t(stages[stage] ? stages[stage].name : stage)}
      </div>
    </div>
  );
};

export default QuestionStageRadioBtn;

export function getStageInfo(stage: QuestionStage, isSelected: boolean = true) {
  try {
    const stageInfo = stages[stage];
    const backgroundColor = stageInfo
      ? `var(${stageInfo.color})`
      : "var(--green)";
    const btnBackgroundColor = stageInfo
      ? isSelected
        ? `var(${stageInfo.color})`
        : "#DCE7FF"
      : "#DCE7FF";
    return { backgroundColor, btnBackgroundColor,stageInfo};
  } catch (error) {
    console.error(error);
    return { backgroundColor: "var(--green)", btnBackgroundColor: "#DCE7FF",stageInfo:undefined, error:true};
  }
}
