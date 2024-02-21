import { Screen, Statement } from "delib-npm";

// custom components
import CustomCheckboxLabel from "./CustomCheckboxLabel";
import { isSubPageChecked } from "../statementSettingsCont";
import CustomSwitch from "../../../../../components/switch/CustomSwitch";

// HELPERS
import { navArray } from "../../nav/top/StatementTopNavModel";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";

export default function CheckBoxeArea({
    statement,
}: {
    statement: Statement | undefined;
}) {
    const { languageData } = useLanguage();

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
                    {languageData["Tabs"]}
                </h3>
                {navArray
                    .filter((navObj) => navObj.link !== Screen.SETTINGS)
                    .map((navObj, index) => (
                        <CustomSwitch
                            key={`tabs-${index}`}
                            link={navObj.link}
                            label={navObj.name}
                            defaultChecked={isSubPageChecked(statement, navObj)}
                        />
                    ))}
            </div>
            <div className="settings__checkboxSection__column">
                <h3 className="settings__checkboxSection__column__title">
                    {languageData["Advanced"]}
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
