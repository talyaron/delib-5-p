import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement } from "delib-npm";

// Redux
import { useAppDispatch } from "../../../../../functions/hooks/reduxHooks";

// Statements helpers
import { getToVoteOnParent } from "../../../../../functions/db/vote/getVotes";
import { setVoteToStore } from "../../../../../model/vote/votesSlice";
import { getTotalVoters } from "./statementVoteCont";

// Custom components
import NewSetStatementSimple from "../set/NewStatementSimple";
import Modal from "../../../../components/modal/Modal";
import HandsIcon from "../../../../components/icons/HandsIcon";
import StatementInfo from "./components/info/StatementInfo";
import StatementBottomNav from "../nav/bottom/StatementBottomNav";

// Helpers
import VotingArea from "./components/VotingArea";

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

    // * Use State * //
    const [showModal, setShowModal] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [statementInfo, setStatementInfo] = useState<Statement | null>(null);

    // * Variables * //
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
                <div
                    className="votingWrapper"
                >
                    <div className="hand">
                        <HandsIcon /> {totalVotes}
                    </div>
                    <VotingArea
                        totalVotes={totalVotes}
                        setShowInfo={setShowInfo}
                        statement={statement}
                        subStatements={subStatements}
                        setStatementInfo={setStatementInfo}
                    />
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
                <StatementBottomNav
                    setShowModal={setShowModal}
                    statement={statement}
                />
            </div>
        </>
    );
};

export default StatementVote;
