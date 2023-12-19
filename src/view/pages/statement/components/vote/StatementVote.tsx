import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement } from "delib-npm";
import { useParams } from "react-router-dom";

// Statements components
import StatementOptionsNav from "../options/components/StatementOptionsNav";

// Redux
import { useAppDispatch } from "../../../../../functions/hooks/reduxHooks";

// Statements helpers
import { getToVoteOnParent } from "../../../../../functions/db/vote/getVotes";
import { setVoteToStore } from "../../../../../model/vote/votesSlice";
import NewSetStatementSimple from "../set/NewStatementSimple";
import { setSelectionsToOptions } from "./setSelectionsToOptions";
import { getTotalVoters } from "./getTotalVoters";
import { sortOptionsIndex } from "./sortOptionsIndex";

// Custom components
import Modal from "../../../../components/modal/Modal";
import { OptionBar } from "./OptionBar";
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeIn";
import { t } from "i18next";
import { isOptionFn } from "../../../../../functions/general/helpers";
import ScreenFadeIn from "../../../../components/animation/ScreenFadeIn";

interface Props {
    statement: Statement;
    subStatements: Statement[];
}
let getVoteFromDB = false;

const StatementVote: FC<Props> = ({ statement, subStatements }) => {
    const dispatch = useAppDispatch();
    const { sort } = useParams();

    const [showModal, setShowModal] = useState(false);

    const __options = subStatements.filter((subStatement: Statement) =>
        isOptionFn(subStatement)
    );
    const _options = setSelectionsToOptions(statement, __options);
    const options = sortOptionsIndex(_options, sort);
    const totalVotes = getTotalVoters(statement);

    useEffect(() => {
        if (!getVoteFromDB) {
            getToVoteOnParent(statement.statementId, updateStoreWitehVoteCB);
            getVoteFromDB = true;
        }
    }, []);

    // useEffect(() => {
    //     setOptions(_options);
    // }, [_options]);

    function updateStoreWitehVoteCB(option: Statement) {
        dispatch(setVoteToStore(option));
    }

    return (
        <ScreenFadeIn className="page__main">
            <div className="statement">
                <div>
                    <h2>{t("Votes")}</h2>
                    <p style={{ maxWidth: "50vw", margin: "0 auto" }}>
                        {t("Voted")}: {totalVotes}
                    </p>
                </div>
                <div className="statement__vote">
                    {options.map((option: Statement, i: number) => {
                        return (
                            <OptionBar
                                key={option.statementId}
                                order={i}
                                option={option}
                                totalVotes={totalVotes}
                                statement={statement}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="page__main__bottom">
                <StatementOptionsNav
                    setShowModal={setShowModal}
                    statement={statement}
                />
            </div>
            {showModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatementId={statement.statementId}
                        isOption={true}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </ScreenFadeIn>
    );
};

export default StatementVote;
