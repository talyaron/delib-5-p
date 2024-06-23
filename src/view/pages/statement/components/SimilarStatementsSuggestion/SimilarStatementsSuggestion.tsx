import React, { useState } from 'react';
import FullScreenModal from '../../../../components/fullScreenModal/FullScreenModal';

import './similarStatementsSuggestion.scss';

import AddQuestionIcon from '../../../../../assets/icons/questionPlus.svg?react';
import LightBulbPlusIcon from '../../../../../assets/icons/lightBulbPlus.svg?react';
import CloseIcon from '../../../../../assets/icons/close.svg?react';
import ArrowLeftIcon from '../../../../../assets/icons/arrow-left.svg?react';
import illustration from '../../../../../assets/images/similarities-Illustration.png';
import viewSimilarStatement from '../../../../../assets/images/view-similar-statement.png';
import StepOneStatementInput from './StepOneStatementInput';
import StepTwoShowSimilarStatements from './StepTwoShowSimilarStatements';
import StepThreeViewSimilarStatement from './StepThreeViewSimilarStatement';
import StepFourContinueWithOwnInput from './StepFourContinueWithOwnInput';

interface SimilarStatementsSuggestionProps {
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	isQuestion: boolean;
}

export default function SimilarStatementsSuggestion({
	setShowModal,
	isQuestion,
}: SimilarStatementsSuggestionProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [newStatementInput, setNewStatementInput] = useState({
		title: 'New Statement Title',
		description: 'New Statement Description text goes here.',
	});
	const [similarStatement, setSimilarStatement] = useState({
		title: '',
		description: '',
	});

	const stepsComponents = [
		<StepOneStatementInput
			setCurrentStep={setCurrentStep}
			newStatementInput={newStatementInput}
			setNewStatementInput={setNewStatementInput}
		/>,
		<StepTwoShowSimilarStatements
			setCurrentStep={setCurrentStep}
			newStatementInput={newStatementInput}
			setSimilarStatement={setSimilarStatement}
		/>,
		<StepThreeViewSimilarStatement
			setCurrentStep={setCurrentStep}
			similarStatement={similarStatement}
		/>,
		<StepFourContinueWithOwnInput
			newStatementInput={newStatementInput}
			setShowModal={setShowModal}
		/>,
	];

	const renderStep = () => {
		return stepsComponents[currentStep];
	};

	return (
		<FullScreenModal>
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
							<img src={viewSimilarStatement} alt='Similarities illustration' />
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
						<div className='type'>
							<AddQuestionIcon />
							<h2 className={isQuestion ? 'marked' : 'unmarked'}>Question</h2>
						</div>
						<div className='type'>
							<LightBulbPlusIcon />
							<h2 className={isQuestion ? 'unmarked' : 'marked'}>Solution</h2>
						</div>
					</div>
				</header>
				{renderStep()}
			</main>
		</FullScreenModal>
	);
}
