import { Screen, Statement } from "delib-npm";

// custom components
import Checkbox from "../../../../../components/checkbox/Checkbox";
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
import { useAppDispatch } from "../../../../../../functions/hooks/reduxHooks";
import { toggleSubscreen } from "../../../../../../model/statements/statementsSlice";

export default function CheckBoxesArea({
    statement,
}: {
    statement: Statement | undefined;
}) {
    const { t } = useLanguage();
    const dispatch = useAppDispatch();

    const subScreens = statement?.subScreens as Screen[] | undefined;

    const hasChildren: boolean =
        statement?.hasChildren === false ? false : true;

    const enhancedEvaluation: boolean =
        statement?.statementSettings?.enhancedEvaluation === false
            ? false
            : true;

    const showEvaluation: boolean =
        statement?.statementSettings?.showEvaluation === false ? false : true;

    const enableAddEvaluationOption: boolean =
        statement?.statementSettings?.enableAddEvaluationOption === false
            ? false
            : true;

    const enableAddVotingOption: boolean =
        statement?.statementSettings?.enableAddVotingOption === false
            ? false
            : true;

    function _toggleSubScreen(screen: Screen, statement: Statement) {
        dispatch(toggleSubscreen({ screen, statement }));
    }

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
                            statement={statement}
                            _toggleSubScreen={_toggleSubScreen}
                            defaultChecked={isSubPageChecked(statement, navObj)}
                            children={<NavIcon screenLink={navObj.link} />}
                        />
                    ))}
            </div>
            <div className="settings__checkboxSection__column">
                <h3 className="settings__checkboxSection__column__title">
                    {t("Advanced")}
                </h3>
                <Checkbox
                    name={"hasChildren"}
                    label={"Enable Sub-Conversations"}
                    defaultChecked={hasChildren}
                />
                <Checkbox
                    name={"enhancedEvaluation"}
                    label={"Enhanced Evaluation"}
                    defaultChecked={enhancedEvaluation}
                />
                <Checkbox
                    name={"showEvaluation"}
                    label={"Show Evaluations results"}
                    defaultChecked={showEvaluation}
                />
                <Checkbox
                    name={"enableAddVotingOption"}
                    label={
                        "Allow participants to contribute options to the voting page"
                    }
                    defaultChecked={enableAddVotingOption}
                />
                <Checkbox
                    name={"enableAddEvaluationOption"}
                    label={
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
