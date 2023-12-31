import React, { FC } from "react";

// Third party libraries
import { Statement, Screen, NavObject } from "delib-npm";
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";

// Custom components
import Fav from "../../../../../components/fav/Fav";

interface Props {
    statement: Statement;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showNav?: boolean;
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
];

const votesArray: NavObject[] = [
    { link: Screen.VOTESֹֹֹ_VOTED, name: t("Vote"), id: Screen.VOTESֹֹֹ_VOTED },
    {
        link: Screen.VOTES_CONSENSUS,
        name: t("Agreement"),
        id: Screen.VOTES_CONSENSUS,
    },
    { link: Screen.VOTES_NEW, name: "New", id: Screen.VOTES_NEW },
    { link: Screen.VOTES_RANDOM, name: "Random", id: Screen.VOTES_RANDOM },
    { link: Screen.VOTES_UPDATED, name: "Update", id: Screen.VOTES_UPDATED },
];

const StatementEvaluationNav: FC<Props> = ({
    setShowModal,
    statement,
    showNav = true,
}) => {
    const { page, sort } = useParams();
    const navArray = page === "vote" ? votesArray : optionsArray;

    const handleToggleModal = () => {
        setShowModal((prev) => !prev);
    };

    //used to check if the user can add a new option in voting and in evaluation screens
    const addOption: boolean | undefined =
        statement.statementSettings?.enableAddEvaluationOption;
    const addVotingOption: boolean | undefined =
        statement.statementSettings?.enableAddVotingOption;

    return (
        <div className="page__footer">
            <nav className="bottomNav" style={{ position: "relative" }}>
                {showNav &&
                    navArray.map((navObject: NavObject) => (
                        <Link
                            key={navObject.id}
                            to={`${navObject.link}`}
                            className={
                                sort === navObject.link
                                    ? "bottomNav__button bottomNav__button--selected"
                                    : "bottomNav__button"
                            }
                        >
                            {t(navObject.name)}
                        </Link>
                    ))}
                {addOption && page === Screen.OPTIONS ? (
                    <Fav isHome={false} onclick={handleToggleModal} />
                ) : null}
                {addVotingOption && page === Screen.VOTE && (
                    <Fav isHome={false} onclick={handleToggleModal} />
                )}
                {page === Screen.QUESTIONS_MASS ? (
                    <Fav isHome={false} onclick={handleToggleModal} />
                ) : null}
            </nav>
        </div>
    );
};

export default StatementEvaluationNav;
