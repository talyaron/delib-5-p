import { FC } from "react";

// Third party imports
import { Link } from "react-router-dom";
import { NavObject, Statement, Screen } from "delib-npm";

// Helpers
import { showNavElements } from "./statementTopNavCont";
import { navArray } from "./StatementTopNavModel";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";

interface Props {
    statement: Statement;
    screen: Screen;
}

const StatementTopNav: FC<Props> = ({ statement, screen }) => {
    const { t } = useLanguage();

    const _navArray = showNavElements(statement, navArray);

    return (
        <nav className="page__header__nav" data-cy="statement-nav">
            {_navArray.map((navObject: NavObject) => (
                <Link
                    key={navObject.id}
                    to={`/statement/${statement.statementId}/${navObject.link}${
                        navObject.link === Screen.VOTE ? "/votes-voted" : ""
                    }`}
                    className={`page__header__nav__button ${
                        screen === navObject.link
                            ? "page__header__nav__button--selected"
                            : ""
                    }`}
                >
                    {t(navObject.name)}
                </Link>
            ))}
        </nav>
    );
};

export default StatementTopNav;
