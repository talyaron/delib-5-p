import { FC } from "react";

// Third party imports
import { Link } from "react-router-dom";
import { NavObject, Statement, Screen } from "delib-npm";

// Helpers
import { showNavElements } from "./statementTopNavCont";
import { allScreens } from "./StatementTopNavModel";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";

interface Props {
    statement: Statement;
    screen: Screen;
}

const StatementTopNav: FC<Props> = ({ statement, screen }) => {
    const { t } = useLanguage();

    const _navArray = showNavElements(statement, allScreens);

    return (
        <nav className="page__header__nav" data-cy="statement-nav">
            {_navArray.map((screenInfo: NavObject) => (
                <Link
                    key={screenInfo.id}
                    to={`/statement/${statement.statementId}/${screenInfo.link}${
                        screenInfo.link === Screen.VOTE ? "/votes-voted" : ""
                    }`}
                    className={`page__header__nav__button ${
                        screen === screenInfo.link
                            ? "page__header__nav__button--selected"
                            : ""
                    }`}
                >
                    {t(screenInfo.name)}
                </Link>
            ))}
        </nav>
    );
};

export default StatementTopNav;
