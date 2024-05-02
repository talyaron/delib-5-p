import { Screen, Statement } from "delib-npm";

// custom components
import CustomSwitch from "../../../../../../components/switch/CustomSwitch";

// HELPERS
import { isSubPageChecked } from "../../statementSettingsCont";
import { allScreensWithoutSettings } from "../../../nav/top/StatementTopNavModel";
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";
import { FC } from "react";
import TabIcon from "./TabIcon";
import "./TabsToDisplay.scss";
import { WithStatement } from "../../settingsTypeHelpers";
import { useAppDispatch } from "../../../../../../../controllers/hooks/reduxHooks";
import { toggleSubscreen } from "../../../../../../../model/statements/statementsSlice";

const TabsToDisplay: FC<WithStatement> = ({ statement }) => {
    const { t } = useLanguage();
    const dispatch = useAppDispatch();

    function _toggleSubScreen(screen: Screen, statement: Statement) {
        dispatch(toggleSubscreen({ screen, statement }));
    }

    return (
        <div className="tabs-to-display-switches">
            <h3 className="title">{t("Tabs to display")}</h3>
            {allScreensWithoutSettings.map((screenInfo) => (
                <CustomSwitch
                    key={`tabs-${screenInfo.id}`}
                    link={screenInfo.link}
                    label={screenInfo.name}
                    statement={statement}
                    _toggleSubScreen={_toggleSubScreen}
                    defaultChecked={isSubPageChecked(statement, screenInfo)}
                    children={<TabIcon screenLink={screenInfo.link} />}
                />
            ))}
        </div>
    );
};

export default TabsToDisplay;
