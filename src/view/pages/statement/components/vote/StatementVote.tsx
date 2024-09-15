import { FC, useEffect, useState } from 'react';

// Third party imports
import { QuestionStage, QuestionType, Statement, StatementType } from 'delib-npm';

// Redux
import { useAppDispatch } from '@/controllers/hooks/reduxHooks';

// Statements helpers
import { getToVoteOnParent } from '@/controllers/db/vote/getVotes';
import { setVoteToStore } from '@/model/vote/votesSlice';
import { getTotalVoters } from './statementVoteCont';

// Custom components
import Modal from '@/view/components/modal/Modal';
import HandIcon from '@/assets/icons/handIcon.svg?react';
import StatementInfo from './components/info/StatementInfo';
import StatementBottomNav from '../nav/bottom/StatementBottomNav';
import './StatementVote.scss';
import X from '@/assets/icons/x.svg?react';

// Helpers
import VotingArea from './components/votingArea/VotingArea';
import { getStagesInfo } from '../settings/components/QuestionSettings/QuestionStageRadioBtn/QuestionStageRadioBtn';
import Toast from '@/view/components/toast/Toast';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import Button from '@/view/components/buttons/button/Button';
import CreateStatementModalSwitch from '../createStatementModalSwitch/CreateStatementModalSwitch';

interface Props {
	statement: Statement;
	subStatements: Statement[];
	
}
let getVoteFromDB = false;

const StatementVote: FC<Props> = ({
	statement,
	subStatements,
	
}) => {
	// * Hooks * //
	const dispatch = useAppDispatch();
	const { t } = useLanguage();

	const currentStage = statement.questionSettings?.currentStage;
	const isCurrentStageVoting = currentStage === QuestionStage.voting;
	const stageInfo = getStagesInfo(currentStage);
	const toastMessage = stageInfo ? stageInfo.message : '';
	const useSearchForSimilarStatements =
		statement.statementSettings?.enableSimilaritiesSearch || false;

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
	const isMuliStage =
		statement.questionSettings?.questionType === QuestionType.multipleSteps;

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
			<div className='page__main'>
				<div className='statement-vote'>
					{showMultiStageMessage && (
						<Toast
							text={t(`${toastMessage}`)}
							type='message'
							show={showMultiStageMessage}
							setShow={setShowMultiStageMessage}
						>
							<Button
								text={t('Got it')}
								iconOnRight={true}
								icon={<X />}
								bckColor='var(--crimson)'
								color='var(--white)'
								onClick={() => setShowMultiStageMessage(false)}
							/>
						</Toast>
					)}
					<div className='number-of-votes-mark'>
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
					<CreateStatementModalSwitch
						allowedTypes={[StatementType.option]}
						isMultiStage={isMuliStage}
						useSimilarStatements={useSearchForSimilarStatements}
						parentStatement={statement}
						isQuestion={false}
						setShowModal={setIsCreateStatementModalOpen}
					
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
			<div className='page__footer'>
				<StatementBottomNav
					setShowModal={setIsCreateStatementModalOpen}
					statement={statement}
				/>
			</div>
		</>
	);
};

export default StatementVote;
