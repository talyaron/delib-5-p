import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
	QuestionStage,
	QuestionType,
	Statement,
	StatementType,
	User,
	isOptionFn,
} from 'delib-npm';
import { sortSubStatements } from './statementSolutionsCont';
import { useLanguage } from '../../../../../controllers/hooks/useLanguages';
import { getTitle } from '../../../../../controllers/general/helpers';
import StatementEvaluationCard from './components/StatementSolutionCard';
import Toast from '../../../../components/toast/Toast';
import Modal from '../../../../components/modal/Modal';
import StatementInfo from '../vote/components/info/StatementInfo';
import CreateStatementModalSwitch from '../createStatementModalSwitch/CreateStatementModalSwitch';
import WhitePlusIcon from '../../../../components/icons/WhitePlusIcon';
import GetToastButtons from './components/GetToastButtons';
import ideaImage from '@/assets/images/manWithIdeaLamp.png';

import './defaultSolutionsPage.scss';

interface StatementEvaluationPageProps {
	statement: Statement;
	subStatements: Statement[];
	handleShowTalker: (talker: User | null) => void;
	currentPage?: string;
	questions?: boolean;
	toggleAskNotifications: () => void;
}

export default function DefaultSolutionsPage({
	statement,
	subStatements,
	handleShowTalker,
	questions = false,
	toggleAskNotifications,
	currentPage = 'suggestion',
}: StatementEvaluationPageProps) {
	const { sort } = useParams();
	const navigate = useNavigate();
	const { t } = useLanguage();

	const [showModal, setShowModal] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [showExplanation, setShowExplanation] = useState(false);
	const [sortedSubStatements, setSortedSubStatements] = useState<Statement[]>(
		[]
	);

	const isMuliStage =
		statement.questionSettings?.questionType === QuestionType.multipleSteps;
	const currentStage =
		statement.questionSettings?.currentStage ?? QuestionStage.suggestion;

	const topSum = 30;
	const tops: number[] = [topSum];

	useEffect(() => {
		const filtered = sortSubStatements(subStatements, sort).filter(
			(subStatement) => {
				if (questions)
					return subStatement.statementType === StatementType.question;

				if (isMuliStage) return subStatement.isPartOfTempPresentation;

				return isOptionFn(subStatement);
			}
		);

		setSortedSubStatements(filtered);
	}, [sort, subStatements, questions, isMuliStage]);

	useEffect(() => {
		if (!questions) setShowToast(true);
		if (
			currentStage === QuestionStage.explanation &&
			isMuliStage &&
			!questions
		) {
			setShowExplanation(true);
		}
		if (currentStage === QuestionStage.voting && !questions) {
			navigate(`/statement/${statement.statementId}/vote`);
		}
	}, [currentStage, questions, isMuliStage, statement.statementId, navigate]);

	const renderContent = () => (
		<>
			{sortedSubStatements.length === 0 ? (
				<EmptyScreen
					currentPage={currentPage}
					handlePlusIconClick={() => setShowModal(true)}
					t={t}
				/>
			) : (
				<>
					<SolutionsHeader
						currentPage={currentPage}
						handlePlusIconClick={() => setShowModal(true)}
						t={t}
					/>
					{sortedSubStatements.map((statementSub, i) => (
						<StatementEvaluationCard
							key={statementSub.statementId}
							parentStatement={statement}
							statement={statementSub}
							showImage={handleShowTalker}
							top={tops[i]}
						/>
					))}
				</>
			)}
			{isMuliStage && (
				<Toast
					text={`${t(currentStage)}${currentStage === QuestionStage.suggestion ? `: "${getTitle(statement)}"` : ''}`}
					type='message'
					show={showToast}
					setShow={setShowToast}
				>
					<GetToastButtons
						questionStage={currentStage}
						setShowToast={setShowToast}
						setShowModal={setShowModal}
					/>
				</Toast>
			)}
			{showExplanation && (
				<Modal>
					<StatementInfo
						statement={statement}
						setShowInfo={setShowExplanation}
					/>
				</Modal>
			)}
			{showModal && (
				<CreateStatementModalSwitch
					toggleAskNotifications={toggleAskNotifications}
					parentStatement={statement}
					isQuestion={questions}
					isMuliStage={isMuliStage}
					setShowModal={setShowModal}
					useSimilarStatements={
						statement.statementSettings?.enableSimilaritiesSearch || false
					}
				/>
			)}
		</>
	);

	return (
		<div className='page__main'>
			<div className='mainWrapper'>{renderContent()}</div>;
		</div>
	);
}

function EmptyScreen({
	currentPage,
	handlePlusIconClick,
	t,
}: {
	currentPage: string;
	handlePlusIconClick: () => void;
	t: (key: string) => string;
}) {
	return (
		<>
			<SolutionsHeader
				currentPage={currentPage}
				handlePlusIconClick={handlePlusIconClick}
				t={t}
			/>
			<img src={ideaImage} alt='' className='ideaImage' />
		</>
	);
}

function SolutionsHeader({
	currentPage,
	handlePlusIconClick,
	t,
}: {
	currentPage: string;
	handlePlusIconClick: () => void;
	t: (key: string) => string;
}) {
	return (
		<div className='header'>
			<h3 className='title'>
				{t(`Click on`)}{' '}
				<span className='titleSpan'>{t(`Add ${currentPage} button`)}</span>{' '}
				{t(`to add your ${currentPage}`)}
			</h3>
			<div className='plusButton' onClick={handlePlusIconClick}>
				<WhitePlusIcon />
				<p>{t(`Add ${currentPage}`)}</p>
			</div>
		</div>
	);
}
