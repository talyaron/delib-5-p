import React, { useState } from 'react';
import FullScreenModal from '../../../../components/fullScreenModal/FullScreenModal';

import './similarStatementsSuggestion.scss';

import AddQuestionIcon from '../../../../../assets/icons/questionPlus.svg?react';
import LightBulbPlusIcon from '../../../../../assets/icons/lightBulbPlus.svg?react';
import CloseIcon from '../../../../../assets/icons/close.svg?react';
import illustration from '../../../../../assets/images/similarities-Illustration.png';
import StepOneStatementInput from './StepOneStatementInput';
import StepTwoShowSimilarStatements from './StepTwoShowSimilarStatements';

interface SimilarStatementsSuggestionProps {
	setShowModal: (show: boolean) => void;
}

export default function SimilarStatementsSuggestion({
	setShowModal,
}: SimilarStatementsSuggestionProps) {
	const [currentStep, setCurrentStep] = useState(0);

	const nextStep = () => {
		setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));
	};

	const prevStep = () => {
		setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
	};

	const stepsComponents = [
		<StepOneStatementInput nextStep={nextStep} />,
		<StepTwoShowSimilarStatements nextStep={nextStep} />,
	];

	const renderStep = () => {
		return stepsComponents[currentStep];
	};

	return (
		<FullScreenModal>
			<main className='similarities'>
				<header className='similarities__header'>
					<div className='similarities__header__top'>
						<img src={illustration} alt='Similarities illustration' />
						<button
							className='similarities__header__top__closeButton'
							onClick={() => setShowModal(false)}
						>
							<CloseIcon />
						</button>
					</div>
					<div className='similarities__header__types'>
						<div className='type'>
							<AddQuestionIcon />
							<h2>Question</h2>
						</div>
						<div className='type'>
							<LightBulbPlusIcon />
							<h2>Solution</h2>
						</div>
					</div>
				</header>
				{renderStep()}
			</main>
		</FullScreenModal>
	);
}
