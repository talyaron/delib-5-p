import { FC } from "react"
import { Link, useParams } from "react-router-dom"
import { Statement, NavObject, Screen } from "delib-npm"
import { showNavElements } from "./statementNvCont"

interface Props {
    statement: Statement
}

export const navArray: NavObject[] = [
    { link: Screen.DOC, name: "ראשי", id: "doc", default: true },
    { link: Screen.CHAT, name: "שיחה", id: "main" },
    { link: Screen.OPTIONS, name: "פתרונות", id: "options" },
    { link: Screen.VOTE, name: "הצבעה", id: "vote" },
    { link: Screen.GROUPS, name: "חדרים", id: "rooms", default: false },
    { link: Screen.SETTINGS, name: "הגדרות", id: "settings" },
]

const StatementNav: FC<Props> = ({ statement }) => {
    const { page } = useParams()
    const _navArray = showNavElements(statement, navArray)

    return (
        <nav className="statement__nav">
            {_navArray.map((navObject: NavObject) => (
                //@ts-ignore
                <Link
                    key={navObject.id}
                    to={`${navObject.link}`}
                    className={
                        page === navObject.link ||
                        (!navObject.link && page === undefined)
                            ? "statement__nav__button statement__nav__button--selected"
                            : "statement__nav__button"
                    }
                >
                    {navObject.name}
                </Link>
            ))}
        </nav>
    )
}

export default StatementNav
