import { QuestionStage, Statement } from "delib-npm";
import { FC } from "react";
import "./QuestionDashboard.scss";

import LightBulbIcon from "../../../../../../../../assets/icons/lightBulbIcon.svg?react";
import UsersIcon from "../../../../../../../../assets/icons/users20px.svg?react";

interface Props {
  statement: Statement;
}

const QuestionDashboard: FC<Props> = ({ statement }) => {
  try {
    return (
      <div className="question-dashboard">
        <div className="question-dashboard__info">
          <div className="joined">
            <div className="joined__icon">
              <UsersIcon />
            </div>
            <div className="joined__text">Joined members</div>
            <div className="joined__number">473</div>
          </div>
          <div className="current-stage">
            <div className="current-stage__title">Current stage</div>
            <div className="current-stage__stage">
              {questionStepDictionary(statement.questionSettings?.currentStep)}
            </div>
          </div>
        </div>
        <div className="question-dashboard__icon">
          <LightBulbIcon />
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return null;
  }

  function questionStepDictionary(
    questionStage: QuestionStage | undefined
  ): string {
    if (!questionStage) return "Suggestion";

    switch (questionStage) {
      case QuestionStage.suggestion:
        return "Suggestion";
      case QuestionStage.voting:
        return "Voting";
      case QuestionStage.firstEvaluation:
        return "First Evaluation";
      case QuestionStage.secondEvaluation:
        return "Second Evaluation";
      default:
        return "Suggestion";
    }
  }
};

export default QuestionDashboard;
