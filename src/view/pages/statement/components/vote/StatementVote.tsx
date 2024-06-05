import { FC, useEffect, useState } from "react";

// Third party imports
import { QuestionStage, Statement } from "delib-npm";

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
import { getStagesInfo } from "../settings/components/QuestionSettings/QuestionStageRadioBtn/QuestionStageRadioBtn";
import Toast from "../../../../components/toast/Toast";

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

  const currentStage = statement.questionSettings?.currentStage;
  const isCurrentStageVoting = currentStage === QuestionStage.voting;
  const stageInfo = getStagesInfo(currentStage);
  const toastMessage = stageInfo ? stageInfo.message : "";

  // * Use State * //
  const [showMultiStageMessage, setShowMultiStageMessage] =
    useState(isCurrentStageVoting);
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
		{showMultiStageMessage && (
          <Toast
            text={`${toastMessage}`}
            type="message"
            show={showMultiStageMessage}
            setShow={setShowMultiStageMessage}
          />
        )}
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
