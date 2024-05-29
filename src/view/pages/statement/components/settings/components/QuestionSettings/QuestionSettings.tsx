import { FC, useState, useEffect } from "react";
import SectionTitle from "../sectionTitle/SectionTitle";
import { StatementSettingsProps } from "../../settingsTypeHelpers";
import CustomSwitchSmall from "../../../../../../components/switch/customSwitchSmall/CustomSwitchSmall";
import { QuestionStage, QuestionType, StatementType } from "delib-npm";
import QuestionDashboard from "./questionDashboard/QuestionDashboard";
import QuestionStageRadioBtn from "./QuestionStageRadioBtn/QuestionStageRadioBtn";

import "./QuestionSettings.scss";

const QuestionSettings: FC<StatementSettingsProps> = ({
  statement,
  setStatementToEdit,
}) => {
  try {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (!statement.questionSettings) {
        setChecked(false);
        return;
      }
      const isChecked =
        statement.questionSettings?.questionType === QuestionType.multipleSteps
          ? false
          : true;
      setChecked(isChecked);
    }, [statement.questionSettings]);

    if (statement.statementType !== StatementType.question) return null;

    return (
      <div className="question-settings">
        <SectionTitle title="Question Settings" />
        <CustomSwitchSmall
          label="Multi-Stage Question"
          checked={checked}
          setChecked={_setChecked}
          textChecked="simple question"
          textUnchecked="multistage question"
        />
        <div className="question-settings__wrapper">
          <QuestionDashboard statement={statement} />
          <QuestionStageRadioBtn
            stage={QuestionStage.suggestion}
            statement={statement}
          />
          <QuestionStageRadioBtn
            stage={QuestionStage.firstEvaluation}
            statement={statement}
          />
          <QuestionStageRadioBtn
            stage={QuestionStage.secondEvaluation}
            statement={statement}
          />
          <QuestionStageRadioBtn
            stage={QuestionStage.voting}
            statement={statement}
          />
          <QuestionStageRadioBtn
            stage={QuestionStage.finished}
            statement={statement}
          />
        </div>
      </div>
    );

    function _setChecked() {
      if (
        statement.questionSettings?.questionType === QuestionType.multipleSteps
      ) {
        setStatementToEdit({
          ...statement,
          questionSettings: {
            ...statement.questionSettings,
            questionType: QuestionType.singleStep,
          },
        });
      } else if (statement.questionSettings === undefined) {
        setStatementToEdit({
          ...statement,
          questionSettings: {
            questionType: QuestionType.singleStep,
            currentStep: QuestionStage.suggestion,
          },
        });
      } else {
        setStatementToEdit({
          ...statement,
          questionSettings: {
            ...statement.questionSettings,
            questionType: QuestionType.multipleSteps,
          },
        });
      }
    }
  } catch (error: any) {
    console.error(error);
    return <p>{error.message}</p>;
  }
};

export default QuestionSettings;
