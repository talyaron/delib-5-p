import React, { FC } from "react";

// Third party libraries
import { Statement } from "delib-npm";
import { Link, useParams } from "react-router-dom";
import { NavObject, Screen } from "../../../../../../model/system";
import { t } from "i18next";

// Custom components
import Fav from "../../../../../components/fav/Fav";

interface Props {
    statement: Statement;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const optionsArray: NavObject[] = [
    {
        link: Screen.EVALUATION_CONSENSUS,
        name: t("Agreement"),
        id: Screen.EVALUATION_CONSENSUS,
    },
    { link: Screen.EVALUATION_NEW, name: t("New"), id: Screen.EVALUATION_NEW },
    {
        link: Screen.EVALUATION_RANDOM,
        name: t("Random"),
        id: Screen.EVALUATION_RANDOM,
    },
    {
        link: Screen.EVALUATION_UPDATED,
        name: t("Update"),
        id: Screen.EVALUATION_UPDATED,
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

const StatementEvaluationNav: FC<Props> = ({ setShowModal, statement }) => {
    const { page, sort } = useParams();
    const navArray = page === "vote" ? votesArray : optionsArray;

    const handleToggleModal = () => {
        setShowModal((prev) => !prev);
    };

    return (
        <nav className="options__nav" style={{ position: "relative" }}>
            {navArray.map((navObject: NavObject) => (
                <Link
                    key={navObject.id}
                    to={`${navObject.link}`}
                    className={
                        sort === navObject.link
                            ? "options__nav__button options__nav__button--selected"
                            : "options__nav__button"
                    }
                >
                    {t(navObject.name)}
                </Link>
            ))}
            {statement.statementSettings?.enableAddEvaluationOption &&
                page === "vote" && (
                    <Fav isHome={false} onclick={handleToggleModal} />
                )}
            {statement.statementSettings?.enableAddVotingOption &&
                page === "options" && (
                    <Fav isHome={false} onclick={handleToggleModal} />
                )}
        </nav>
    );
};

export default StatementEvaluationNav;
