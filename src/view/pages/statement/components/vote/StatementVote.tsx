import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement } from "delib-npm";

// Redux
import { useAppDispatch } from "../../../../../controllers/hooks/reduxHooks";

// Statements helpers
import { getToVoteOnParent } from "../../../../../controllers/db/vote/getVotes";
import { setVoteToStore } from "../../../../../model/vote/votesSlice";
import { getTotalVoters } from "./statementVoteCont";

// Custom components
import CreateStatementModal from "../createStatementModal/CreateStatementModal";
import Modal from "../../../../components/modal/Modal";
import HandIcon from "../../../../../assets/icons/handIcon.svg?react";
import StatementInfo from "./components/info/StatementInfo";
import StatementBottomNav from "../nav/bottom/StatementBottomNav";
import "./StatementVote.scss";

// Helpers
import VotingArea from "./components/votingArea/VotingArea";

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
    const [isCreateStatementModalOpen, setIsCreateStatementModalOpen] =
        useState(false);
    const [isStatementInfoModalOpen, setIsStatementInfoModalOpen] =
        useState(false);
    const [statementInfo, setStatementInfo] = useState<Statement | null>(null);

    // * Variables * //
    const totalVotes = getTotalVoters(statement);

    useEffect(() => {
        if (!getVoteFromDB) {
            getToVoteOnParent(statement.statementId, updateStoreWithVoteCB);
            getVoteFromDB = true;
        }
    }, []);

    function updateStoreWithVoteCB(option: Statement) {
        dispatch(setVoteToStore(option));
    }

    return (
        <>
            <div className="page__main">
                <div className="statement-vote">
                    <div className="number-of-votes-mark">
                        <HandIcon /> {totalVotes}
                    </div>
                    <VotingArea
                        totalVotes={totalVotes}
                        setShowInfo={setIsStatementInfoModalOpen}
                        statement={statement}
                        subStatements={subStatements}
                        setStatementInfo={setStatementInfo}
                    />
                </div>

                {isCreateStatementModalOpen && (
                    <CreateStatementModal
                        parentStatement={statement}
                        isOption={true}
                        setShowModal={setIsCreateStatementModalOpen}
                        toggleAskNotifications={toggleAskNotifications}
                    />
                )}
                {isStatementInfoModalOpen && (
                    <Modal>
                        <StatementInfo
                            statement={statementInfo}
                            setShowInfo={setIsStatementInfoModalOpen}
                        />
                    </Modal>
                )}
            </div>
            <div className="page__footer">
                <StatementBottomNav
                    setShowModal={setIsCreateStatementModalOpen}
                    statement={statement}
                />
            </div>
        </>
    );
};

export default StatementVote;
