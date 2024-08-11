// custom components
import CustomSwitch from "@/view/components/switch/customSwitch/CustomSwitch";

// HELPERS
import { allScreensWithoutSettings } from "../../../nav/top/StatementTopNavModel.tsx";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { FC } from "react";
import TabIcon from "./TabIcon";
import { StatementSettingsProps } from "../../settingsTypeHelpers";
import "./SubScreensToDisplay.scss";
import { toggleSubScreen } from "../../statementSettingsCont";
import { defaultStatementSubScreens } from "../../emptyStatementModel";
import { isScreenAllowedUnderStatementType } from "delib-npm";



const SubScreensToDisplay: FC<StatementSettingsProps> = ({
	statement,
	setStatementToEdit,
}) => {
	const { t } = useLanguage();

	const subScreens = statement.subScreens ?? defaultStatementSubScreens;

	return (
		<div className="sub-screens-to-display">
			<h3 className="title">{t("Tabs to display")}</h3>
			{allScreensWithoutSettings.map((screenInfo) => {
				const checked = subScreens.includes(screenInfo.link) ?? false;

				if(isScreenAllowedUnderStatementType(statement, screenInfo.link) === false) return null;

				return (
					<CustomSwitch
						key={`tabs-${screenInfo.id}`}
						setChecked={() => {
							const newStatement = toggleSubScreen({
								statement,
								subScreens,
								screenLink: screenInfo.link,
							});
							setStatementToEdit(newStatement);
						}}
						name={screenInfo.link}
						label={screenInfo.name}
						checked={checked}
						children={<TabIcon screenLink={screenInfo.link} />}
					/>
				);
			})}
		</div>
	);
};

export default SubScreensToDisplay;
