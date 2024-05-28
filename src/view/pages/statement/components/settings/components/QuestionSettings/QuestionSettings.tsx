import { FC, useState, useEffect } from "react";
import SectionTitle from "../sectionTitle/SectionTitle";
import { StatementSettingsProps } from "../../settingsTypeHelpers";
import CustomSwitchSmall from "../../../../../../components/switch/customSwitchSmall/CustomSwitchSmall";
import { QuestionStep, QuestionType, StatementType } from "delib-npm";
import QuestionDashboard from "./questionDashboard/QuestionDashboard";

const QuestionSettings: FC<StatementSettingsProps> = ({
  statement,
  setStatementToEdit,
}) => {
  const [checked, setChecked] = useState(
    statement.questionSettings?.questionType === QuestionType.multipleSteps
      ? true
      : false
  );

  useEffect(() => {
    console.log("statement.questionSettings", statement.questionSettings);
    setChecked(
      statement.questionSettings?.questionType === QuestionType.multipleSteps
        ? false
        : true
    );
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
      <QuestionDashboard statement={statement} />
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
          currentStep: QuestionStep.suggestion,
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
};

export default QuestionSettings;
