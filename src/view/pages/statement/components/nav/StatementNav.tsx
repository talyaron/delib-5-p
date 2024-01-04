import { FC } from "react";
import { Link } from "react-router-dom";
import { Statement, NavObject, Screen } from "delib-npm";
import { showNavElements } from "./statementNavCont";
import { t } from "i18next";

interface Props {
    statement: Statement;
    screen: Screen;
}

export const navArray: NavObject[] = [
    { link: Screen.DOC, name: "Main", id: "doc", default: true },
    { link: Screen.CHAT, name: "Chat", id: "main" },
    { link: Screen.OPTIONS, name: "Evaluations", id: "options" },
    { link: Screen.VOTE, name: "Voting", id: "vote" },
    {
        link: Screen.QUESTIONS_MASS,
        name: "Mass Questions",
        id: "questions",
        default: false,
    },
    { link: Screen.GROUPS, name: "Rooms", id: "rooms", default: false },

    { link: Screen.SETTINGS, name: "Settings", id: "settings" },
];

const StatementNav: FC<Props> = ({ statement, screen }) => {
    const _navArray = showNavElements(statement, navArray);

    return (
        <nav className="statement__nav">
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
                    {t(navObject.name)}
                </Link>
            ))}
        </nav>
    );
};

export default StatementNav;
