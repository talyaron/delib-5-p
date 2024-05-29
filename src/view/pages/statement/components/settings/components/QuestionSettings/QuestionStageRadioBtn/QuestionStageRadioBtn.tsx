import { FC } from "react";
import "./QuestionStageRadioBtn.scss";
import { QuestionStage } from "delib-npm";

import LightBulbIcon from "../../../../../../../../assets/icons/lightBulbIcon.svg?react";
import ArrowUp from "../../../../../../../../assets/icons/arrowUpIcon.svg?react";
import EvaluationsIcon from "../../../../../../../../assets/icons/evaluations2Icon.svg?react";
import HandIcon from "../../../../../../../../assets/icons/handIcon.svg?react";
import FlagIcon from "../../../../../../../../assets/icons/flagIcon.svg?react";
import { setQuestionStage } from "../../../../../../../../controllers/db/statements/setStatements";

interface Props {
  stage: QuestionStage;
  statementId: string;
}

const stages = {
  [QuestionStage.suggestion]: {
    name: "Suggestion",
    icon:  <LightBulbIcon className="img" />,
    color: "--settings-suggestions",
  },
  [QuestionStage.firstEvaluation]: {
    name: "First Evaluation",
    icon: <EvaluationsIcon className="img" />,
    color: "--settings-first-evaluation",
  },
  [QuestionStage.secondEvaluation]: {
    name: "Second Evaluation",
    icon: <ArrowUp className="img" />,
    color: "--settings-second-evaluation",
  },
  [QuestionStage.voting]: {
    name: "Voting",
    icon: <HandIcon className="img" />,
    color: "--settings-voting",
  },
  [QuestionStage.finished]: {
    name: "Finished",
    icon: <FlagIcon className="img" />,
    color: "--settings-finished",
  },
};

const QuestionStageRadioBtn: FC<Props> = ({ stage, statementId }) => {

  const backgroundColor = stages[stage] ? stages[stage].color : "--green"
  return (
    <div className="question-stage-radio-btn">
      <div
        className="question-stage-radio-btn__top"
        style={{
          backgroundColor: `var(${backgroundColor})`,
        }}
      >
       {stages[stage] ? stages[stage].icon : <LightBulbIcon className="img" />}
        <div className="number">324</div>
      </div>
      <div className="question-stage-radio-btn__radio" onClick={()=>{setQuestionStage({statementId,stage})}}>
        <div className="radio-button" style={{backgroundColor: `var(${backgroundColor})`}} >
          <input type="radio" name="question-stage" id={`question-stage-${stage}`} />
          <div className="radio-button__inner"></div>
        </div>
        {stages[stage] ? stages[stage].name : stage}
      </div>
    </div>
  );
};

export default QuestionStageRadioBtn;
