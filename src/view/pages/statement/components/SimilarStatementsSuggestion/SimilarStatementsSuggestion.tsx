import React, { useState } from 'react';
import FullScreenModal from '@/view/components/fullScreenModal/FullScreenModal';

import './similarStatementsSuggestion.scss';

// import AddQuestionIcon from '@/assets/icons/questionPlus.svg?react';
import LightBulbPlusIcon from '@/assets/icons/lightBulbPlus.svg?react';
import CloseIcon from '@/assets/icons/close.svg?react';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react';
import illustration from '@/assets/images/similarities-Illustration.png';
import illustration02 from '@/assets/images/view-similar-statement.png';
import StepOneStatementInput from './StepOneStatementInput';
import StepTwoShowSimilarStatements from './StepTwoShowSimilarStatements';
import StepThreeViewSimilarStatement from './StepThreeViewSimilarStatement';
import StepFourContinueWithOwnInput from './StepFourContinueWithOwnInput';
import { createStatementFromModal } from '../settings/statementSettingsCont';
import { Statement } from 'delib-npm';
import Loader from '@/view/components/loaders/Loader';

interface SimilarStatementsSuggestionProps {
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	isQuestion: boolean;
	parentStatement: Statement;
	toggleAskNotifications?: () => void;
	isSendToStoreTemp?: boolean;
	getSubStatements?: () => Promise<void>;
}

interface DisplayStatement {
	title: string;
	description: string;
}

const initDisplayStatement: DisplayStatement = {
	title: '',
	description: '',
};

export default function SimilarStatementsSuggestion({
	setShowModal,
	isQuestion,
	parentStatement,
	isSendToStoreTemp,
	toggleAskNotifications,
	getSubStatements,
}: Readonly<SimilarStatementsSuggestionProps>) {
	const [currentStep, setCurrentStep] = useState(0);
	const [newStatementInput, setNewStatementInput] =
		useState(initDisplayStatement);
	const [similarStatements, setSimilarStatements] = useState<
		DisplayStatement[]
	>([]);
	const [viewSimilarStatement, setViewSimilarStatement] =
		useState(initDisplayStatement);
	const [isLoading, setIsLoading] = useState(false);

	const onFormSubmit = async () => {
		setIsLoading(true);

		await createStatementFromModal({
			title: newStatementInput.title,
			description: newStatementInput.description,
			isOptionSelected: !isQuestion,
			toggleAskNotifications,
			parentStatement,
			isSendToStoreTemp,
		});

		setShowModal(false);
		setIsLoading(false);

		await getSubStatements?.();
	};

	const stepsComponents = [
		<StepOneStatementInput
			key={0}
			statementId={parentStatement.statementId}
			setCurrentStep={setCurrentStep}
			newStatementInput={newStatementInput}
			setNewStatementInput={setNewStatementInput}
			setSimilarStatements={setSimilarStatements}
			onFormSubmit={onFormSubmit}
		/>,
		<StepTwoShowSimilarStatements
			key={1}
			setCurrentStep={setCurrentStep}
			newStatementInput={newStatementInput}
			similarStatements={similarStatements}
			setViewSimilarStatement={setViewSimilarStatement}
		/>,
		<StepThreeViewSimilarStatement
			key={2}
			setCurrentStep={setCurrentStep}
			viewSimilarStatement={viewSimilarStatement}
			setShowModal={setShowModal}
		/>,
		<StepFourContinueWithOwnInput
			key={3}
			setCurrentStep={setCurrentStep}
			newStatementInput={newStatementInput}
			onFormSubmit={onFormSubmit}
		/>,
	];

	const renderStep = () => {
		return stepsComponents[currentStep];
	};

	return (
		<FullScreenModal>
			{isLoading ? (
				<Loader />
			) : (
				<main className='similarities'>
					<header className='similarities__header'>
						{currentStep === 2 ? (
							<div className='similarities__header__top'>
								<button
									className='similarities__header__top__closeButton'
									onClick={() => setShowModal(false)}
								>
									<ArrowLeftIcon />
								</button>
								<img src={illustration02} alt='Similarities illustration' />
							</div>
						) : (
							<div className='similarities__header__top'>
								<img
									src={illustration}
									alt='Similarities illustration'
									style={{ width: '40%' }}
								/>
								<button
									className='similarities__header__top__closeButton'
									onClick={() => setShowModal(false)}
								>
									<CloseIcon />
								</button>
							</div>
						)}
						<div className='similarities__header__types'>
							{/* <div className='type'>
								<AddQuestionIcon />
								<h2 className={isQuestion ? 'marked' : 'unmarked'}>Question</h2>
							</div> */}
							<div className='type'>
								<LightBulbPlusIcon />
								<h2 className={isQuestion ? 'unmarked' : 'marked'}>Solution</h2>
							</div>
						</div>
					</header>
					{renderStep()}
				</main>
			)}
		</FullScreenModal>
	);
}
