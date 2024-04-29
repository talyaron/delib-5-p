// custom components
import Checkbox from "../../../../../../components/checkbox/Checkbox";

// HELPERS
import { useLanguage } from "../../../../../../../functions/hooks/useLanguages";
import { FC } from "react";
import "./AdvancedSettings.scss";
import { WithStatement } from "../../settingsTypeHelpers";

const AdvancedSettings: FC<WithStatement> = ({ statement }) => {
    const { t } = useLanguage();

    const { hasChildren, statementSettings } = statement || {};
    const {
        enhancedEvaluation,
        showEvaluation,
        enableAddEvaluationOption,
        enableAddVotingOption,
    } = statementSettings || {};

    const shouldEnableSubConversations = hasChildren === false ? false : true;

    const shouldDisplayEnhancedEvaluation =
        enhancedEvaluation === false ? false : true;

    const shouldDisplayEvaluation = showEvaluation === false ? false : true;

    const shouldEnableAddEvaluationOption =
        enableAddEvaluationOption === false ? false : true;

    const shouldEnableAddVotingOption =
        enableAddVotingOption === false ? false : true;

    return (
        <div className="advanced-settings">
            <h3 className="title">{t("Advanced")}</h3>
            <Checkbox
                name={"shouldEnableSubConversations"}
                label={"Enable Sub-Conversations"}
                defaultChecked={shouldEnableSubConversations}
            />
            <Checkbox
                name={"enhancedEvaluation"}
                label={"Enhanced Evaluation"}
                defaultChecked={shouldDisplayEnhancedEvaluation}
            />
            <Checkbox
                name={"showEvaluation"}
                label={"Show Evaluations results"}
                defaultChecked={shouldDisplayEvaluation}
            />
            <Checkbox
                name={"enableAddVotingOption"}
                label={
                    "Allow participants to contribute options to the voting page"
                }
                defaultChecked={shouldEnableAddVotingOption}
            />
            <Checkbox
                name={"enableAddEvaluationOption"}
                label={
                    "Allow participants to contribute options to the evaluation page"
                }
                defaultChecked={shouldEnableAddEvaluationOption}
            />
        </div>
    );
};

export default AdvancedSettings;
