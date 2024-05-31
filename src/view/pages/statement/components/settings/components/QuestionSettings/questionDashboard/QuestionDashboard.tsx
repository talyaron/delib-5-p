import { QuestionStage, Statement } from "delib-npm";
import { FC } from "react";
import "./QuestionDashboard.scss";


import UsersIcon from "../../../../../../../../assets/icons/users20px.svg?react";
import { useAppSelector } from "../../../../../../../../controllers/hooks/reduxHooks";
import { statementMetaDataSelector } from "../../../../../../../../model/statements/statementsMetaSlice";
import { getStageInfo } from "../QuestionStageRadioBtn/QuestionStageRadioBtn";
import { useLanguage } from "../../../../../../../../controllers/hooks/useLanguages";

interface Props {
  statement: Statement;
}

const QuestionDashboard: FC<Props> = ({ statement }) => {
  try {

    const { t } = useLanguage();
    const numberOfMembers:number = useAppSelector(statementMetaDataSelector(statement.statementId))?.question?.numberOfMembers || 0;
    const currentStage = statement.questionSettings?.currentStage || QuestionStage.suggestion;

    const {backgroundColor, stageInfo} = getStageInfo(currentStage, true);

    return (
      <div className="question-dashboard">
        <div className="question-dashboard__info">
          <div className="joined">
            <div className="joined__icon" >
              <UsersIcon />
            </div>
            <div className="joined__text">{t("Joined members")}</div>
            <div className="joined__number">{numberOfMembers}</div>
          </div>
          <div className="current-stage">
            <div className="current-stage__title">{t("Current stage") } </div>
            <div className="current-stage__stage">
              {t(questionStepDictionary(statement.questionSettings?.currentStage))}
            </div>
          </div>
        </div>
        <div className="question-dashboard__icon" style={{backgroundColor}}>
          {stageInfo?.icon?stageInfo.icon:null}
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
        return "Suggestions";
      case QuestionStage.voting:
        return "Voting";
      case QuestionStage.firstEvaluation:
        return "First Evaluation";
      case QuestionStage.secondEvaluation:
        return "Second Evaluation";
      case QuestionStage.finished:
        return "Finished";
      default:
        return "Suggestions";
    }
  }
};

export default QuestionDashboard;
