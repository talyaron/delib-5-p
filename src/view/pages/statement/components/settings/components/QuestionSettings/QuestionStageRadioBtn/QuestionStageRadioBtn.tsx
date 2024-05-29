import { FC } from "react";
import "./QuestionStageRadioBtn.scss";
import { QuestionStage } from "delib-npm";
import LightBulbIcon from "../../../../../../../../assets/icons/lightBulbIcon.svg?react";

interface Props {
  stage: QuestionStage;
}

const QuestionStageRadioBtn: FC<Props> = ({ stage }) => {
  return (
    <div className="question-stage-radio-btn">
      <div className="question-stage-radio-btn__top">
        <LightBulbIcon className="img" />
        <div className="number">324</div>
      </div>
      <div className="question-stage-radio-btn__radio">
        {stage}
        <input type="radio" name="question-stage" id="question-stage-1" />
        <label htmlFor="question-stage-1">1</label>
      </div>
    </div>
  );
};

export default QuestionStageRadioBtn;
