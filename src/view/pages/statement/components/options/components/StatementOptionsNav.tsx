import { FC } from "react"
import { Link, useParams } from "react-router-dom"
import { Statement } from "delib-npm"
import { NavObject, Screen } from "../../../../../../model/system"
import { t } from "i18next"

interface Props {
    statement: Statement
}

const optionsArray: NavObject[] = [
    {
        link: Screen.OPTIONS_CONSENSUS,
        name: t("Agreement"),
        id: Screen.OPTIONS_CONSENSUS,
    },
    { link: Screen.OPTIONS_NEW, name: t("New"), id: Screen.OPTIONS_NEW },
    {
        link: Screen.OPTIONS_RANDOM,
        name: t("Random"),
        id: Screen.OPTIONS_RANDOM,
    },
    {
        link: Screen.OPTIONS_UPDATED,
        name: t("Update"),
        id: Screen.OPTIONS_UPDATED,
    },
]

const votesArray: NavObject[] = [
    { link: Screen.VOTESֹֹֹ_VOTED, name: t("Vote"), id: Screen.VOTESֹֹֹ_VOTED },
    {
        link: Screen.VOTES_CONSENSUS,
        name: t("Agreement"),
        id: Screen.VOTES_CONSENSUS,
    },
    { link: Screen.VOTES_NEW, name: t("New"), id: Screen.VOTES_NEW },
    { link: Screen.VOTES_RANDOM, name: t("Random"), id: Screen.VOTES_RANDOM },
    { link: Screen.VOTES_UPDATED, name: t("Update"), id: Screen.VOTES_UPDATED },
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
