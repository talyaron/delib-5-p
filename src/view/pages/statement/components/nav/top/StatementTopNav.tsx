import { FC } from "react";
import { Link } from "react-router-dom";
import { showNavElements } from "./statementTopNavCont";
import { NavObject, Statement, Screen } from "delib-npm";
import { navArray } from "./StatementTopNavModel";

interface Props {
    statement: Statement;
    screen: Screen;
}

const StatementTopNav: FC<Props> = ({ statement, screen }) => {
    const _navArray = showNavElements(statement, navArray);

    return (
        <nav className="statement__nav" data-cy="statement-nav">
            {_navArray.map((navObject: NavObject) => (
                <Link
                    key={navObject.id}
                    to={`/statement/${statement.statementId}/${navObject.link}${
                        navObject.link === Screen.VOTE ? "/votes-voted" : ""
                    }`}
                    className={`statement__nav__button ${
                        screen === navObject.link
                            ? "statement__nav__button--selected"
                            : ""
                    }`}
                >
                    {(navObject.name)}
                </Link>
            ))}
        </nav>
    );
};

export default StatementTopNav;
