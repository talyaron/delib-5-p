import { FC } from "react";
import SectionTitle from "../sectionTitle/SectionTitle";
import { StatementSettingsProps } from "../../settingsTypeHelpers";
import CustomSwitch from "../../../../../../components/switch/customSwitch/CustomSwitch";
import CustomSwitchSmall from "../../../../../../components/switch/customSwitchSmall/CustomSwitchSmall";

const QuestionSettings: FC<StatementSettingsProps> = () => {
  return (
    <div className="question-settings">
      <SectionTitle title="Question Settings" />
      {/* <CustomSwitch
        label="Multi-Stage Question"
        name="multiStageQuestion"
        checked={false}
        setChecked={() => {}}
      >
        <div>Icon</div>
      </CustomSwitch> */}
      <CustomSwitchSmall
        label="Multi-Stage Question"
        checked={false}
        setChecked={() => {}}
        textChecked="simple question"
        textUnchecked="multistage question"
      />
    </div>
  );
};

export default QuestionSettings;
