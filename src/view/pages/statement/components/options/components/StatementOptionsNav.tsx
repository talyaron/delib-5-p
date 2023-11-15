import { FC } from "react"
import { Link, useParams } from "react-router-dom"
import { Statement } from "delib-npm"
import { NavObject, Screen } from "../../../../../../model/system"

interface Props {
    statement: Statement
}

const optionsArray: NavObject[] = [
    {
        link: Screen.OPTIONS_CONSENSUS,
        name: "הסכמה",
        id: Screen.OPTIONS_CONSENSUS,
    },
    { link: Screen.OPTIONS_NEW, name: "חדש", id: Screen.OPTIONS_NEW },
    { link: Screen.OPTIONS_RANDOM, name: "אקראי", id: Screen.OPTIONS_RANDOM },
    {
        link: Screen.OPTIONS_UPDATED,
        name: "עידכון",
        id: Screen.OPTIONS_UPDATED,
    },
]

const votesArray: NavObject[] = [
    { link: Screen.VOTESֹֹֹ_VOTED, name: "הצבעה", id: Screen.VOTESֹֹֹ_VOTED },
    { link: Screen.VOTES_CONSENSUS, name: "הסכמה", id: Screen.VOTES_CONSENSUS },
    { link: Screen.VOTES_NEW, name: "חדש", id: Screen.VOTES_NEW },
    { link: Screen.VOTES_RANDOM, name: "אקראי", id: Screen.VOTES_RANDOM },
    { link: Screen.VOTES_UPDATED, name: "עידכון", id: Screen.VOTES_UPDATED },
]

const StatementOptionsNav: FC<Props> = () => {
    const { page, sort } = useParams()
    const navArray = page === "vote" ? votesArray : optionsArray

    return (
        <nav className="options__nav">
            {navArray.map((navObject: NavObject) => (
                <Link
                    key={navObject.id}
                    to={`${page}/${navObject.link}`}
                    className={
                        sort === navObject.link
                            ? "options__nav__button options__nav__button--selected"
                            : "options__nav__button"
                    }
                >
                    {navObject.name}
                </Link>
            ))}
        </nav>
    )
}

export default StatementOptionsNav
