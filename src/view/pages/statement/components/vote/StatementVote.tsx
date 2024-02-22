import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement } from "delib-npm";
import { useParams } from "react-router-dom";

// Statements components
import StatementOptionsNav from "../evaluations/components/StatementEvaluationNav";

// Redux
import { useAppDispatch } from "../../../../../functions/hooks/reduxHooks";

// Statements helpers
import { getToVoteOnParent } from "../../../../../functions/db/vote/getVotes";
import { setVoteToStore } from "../../../../../model/vote/votesSlice";
import { setSelectionsToOptions } from "./setSelectionsToOptions";
import { getTotalVoters } from "./getTotalVoters";
import { sortOptionsIndex } from "./sortOptionsIndex";

// Custom components
import NewSetStatementSimple from "../set/NewStatementSimple";
import Modal from "../../../../components/modal/Modal";
import { OptionBar } from "./OptionBar";
import HandsIcon from "../../../../components/icons/HandsIcon";
import StatementInfo from "./info/StatementInfo";

// Helpers
import { isOptionFn } from "../../../../../functions/general/helpers";

interface Props {
    statement: Statement;
    subStatements: Statement[];
    toggleAskNotifications: () => void;
}
let getVoteFromDB = false;

const StatementVote: FC<Props> = ({
    statement,
    subStatements,
    toggleAskNotifications,
}) => {
    // * Hooks * //
    const dispatch = useAppDispatch();
    const { sort } = useParams();

    // * Use State * //
    const [showModal, setShowModal] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [statementInfo, setStatementInfo] = useState<Statement | null>(null);

    // * Variables * //
    const __options = subStatements.filter((subStatement: Statement) =>
        isOptionFn(subStatement),
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

    function updateStoreWitehVoteCB(option: Statement) {
        dispatch(setVoteToStore(option));
    }

    return (
        <>
            <div className="page__main">
                <div className="votingWrapper">
                    <div>
                        <p
                            style={{
                                maxWidth: "50vw",
                                margin: " 2rem auto",
                                color: "#41A1DA",
                                fontFamily: "Patrick Hand",
                            }}
                            className="hand"
                        >
                            <HandsIcon /> {totalVotes}
                        </p>
                    </div>
                    <div className="vote">
                        {options.map((option: Statement, i: number) => {
                            return (
                                <OptionBar
                                    key={option.statementId}
                                    order={i}
                                    option={option}
                                    totalVotes={totalVotes}
                                    statement={statement}
                                    setShowInfo={setShowInfo}
                                    setStatementInfo={setStatementInfo}
                                />
                            );
                        })}
                    </div>
                </div>

                {showModal && (
                    <Modal>
                        <NewSetStatementSimple
                            parentStatement={statement}
                            isOption={true}
                            setShowModal={setShowModal}
                            toggleAskNotifications={toggleAskNotifications}
                        />
                    </Modal>
                )}
                {showInfo && (
                    <Modal>
                        <StatementInfo
                            statement={statementInfo}
                            setShowInfo={setShowInfo}
                        />
                    </Modal>
                )}
            </div>
            <div className="page__footer">
                <StatementOptionsNav
                    setShowModal={setShowModal}
                    statement={statement}
                />
            </div>
        </>
    );
};

export default StatementVote;
