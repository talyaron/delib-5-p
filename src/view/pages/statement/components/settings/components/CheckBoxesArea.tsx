import { Screen, Statement } from "delib-npm";

// custom components
import CustomCheckboxLabel from "./CustomCheckboxLabel";
import { isSubPageChecked } from "../statementSettingsCont";
import CustomSwitch from "../../../../../components/switch/CustomSwitch";

// HELPERS
import { navArray } from "../../nav/top/StatementTopNavModel";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";

import { FC } from "react";

// icons
import NetworkIcon from "../../../../../../assets/icons/networkIcon.svg?react";
import ChatIcon from "../../../../../../assets/icons/roundedChatDotIcon.svg?react";
import EvaluationsIcon from "../../../../../../assets/icons/evaluationsIcon.svg?react";
import VotingIcon from "../../../../../../assets/icons/votingIcon.svg?react";
import QuestionIcon from "../../../../../../assets/icons/questionIcon.svg?react";
import MassQuestionsIcon from "../../../../../../assets/icons/massQuestionsIcon.svg?react";
import RoomsIcon from "../../../../../../assets/icons/roomsIcon.svg?react";
import SettingsIcon from "../../../../../../assets/icons/settingsIcon.svg?react";

export default function CheckBoxesArea({
    statement,
}: {
    statement: Statement | undefined;
}) {
    const { t } = useLanguage();

    const hasChildren: boolean =
        statement?.hasChildren === false ? false : true;

    const enableAddEvaluationOption: boolean =
        statement?.statementSettings?.enableAddEvaluationOption === false
            ? false
            : true;

    const enableAddVotingOption: boolean =
        statement?.statementSettings?.enableAddVotingOption === false
            ? false
            : true;

    return (
        <section className="settings__checkboxSection">
            <div className="settings__checkboxSection__column">
                <h3 className="settings__checkboxSection__column__title">
                    {t("Tabs")}
                </h3>
                {navArray
                    .filter((navObj) => navObj.link !== Screen.SETTINGS)
                    .map((navObj, index) => (
                        <CustomSwitch
                            key={`tabs-${index}`}
                            link={navObj.link}
                            label={navObj.name}
                            defaultChecked={isSubPageChecked(statement, navObj)}
                            children={<NavIcon screenLink={navObj.link} />}
                        />
                    ))}
            </div>
            <div className="settings__checkboxSection__column">
                <h3 className="settings__checkboxSection__column__title">
                    {t("Advanced")}
                </h3>
                <CustomCheckboxLabel
                    name={"hasChildren"}
                    title={"Enable Sub-Conversations"}
                    defaultChecked={hasChildren}
                />
                <CustomCheckboxLabel
                    name={"enableAddVotingOption"}
                    title={
                        "Allow participants to contribute options to the voting page"
                    }
                    defaultChecked={enableAddVotingOption}
                />
                <CustomCheckboxLabel
                    name={"enableAddEvaluationOption"}
                    title={
                        "Allow participants to contribute options to the evaluation page"
                    }
                    defaultChecked={enableAddEvaluationOption}
                />
            </div>
        </section>
    );
}

interface NavIconProps {
    screenLink: Screen;
}

const NavIcon: FC<NavIconProps> = ({ screenLink }) => {
    switch (screenLink) {
        case Screen.DOC:
            return <NetworkIcon />;
        case Screen.CHAT:
            return <ChatIcon />;
        case Screen.OPTIONS:
            return <EvaluationsIcon />;
        case Screen.VOTE:
            return <VotingIcon />;
        case Screen.QUESTIONS:
            return <QuestionIcon />;
        case Screen.MASS_QUESTIONS:
            return <MassQuestionsIcon />;
        case Screen.GROUPS:
            return <RoomsIcon />;
        case Screen.SETTINGS:
            return <SettingsIcon />;
        default:
            return <QuestionIcon />;
    }
};
