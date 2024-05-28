import { QuestionStage, Statement } from "delib-npm";
import { FC } from "react";
import "./QuestionDashboard.scss";

interface Props {
  statement: Statement;
}

const QuestionDashboard: FC<Props> = ({ statement }) => {
  return (
    <div className="question-dashboard">
      <div className="question-dashboard__info">
        <div className="joined">Joined members</div>
        <div className="current-stage">
          <div className="current-stage__title">Current stage</div>
          <div className="current-stage__info">
            {questionStepDictionary(statement.questionSettings?.currentStep)}
          </div>
        </div>
      </div>
      <div className="question-dashboard__icon">ICON</div>
    </div>
  );

  function questionStepDictionary(
    questionStage: QuestionStage | undefined
  ): string {
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
