import React, { useState } from 'react';
import FullScreenModal from '@/view/components/fullScreenModal/FullScreenModal';

import './similarStatementsSuggestion.scss';

import CloseIcon from '@/assets/icons/close.svg?react';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react';
import illustration from '@/assets/images/similarities-Illustration.png';
import illustration01 from '@/assets/images/view-similar-statement.png';
import illustration02 from '@/assets/images/view-similar-statement-step2.png';
import StepOneStatementInput from './StepOneStatementInput';
import StepTwoShowSimilarStatements from './StepTwoShowSimilarStatements';
import StepThreeViewSimilarStatement from './StepThreeViewSimilarStatement';
import StepFourContinueWithOwnInput from './StepFourContinueWithOwnInput';
import { createStatementFromModal } from '../settings/statementSettingsCont';
import { Statement } from 'delib-npm';
import Loader from '@/view/components/loaders/Loader';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface SimilarStatementsSuggestionProps {
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	isQuestion: boolean;
	parentStatement: Statement;
	toggleAskNotifications?: () => void;
	isSendToStoreTemp?: boolean;
	getSubStatements?: () => Promise<void>;
}

export interface DisplayStatement {
	title: string;
	description: string;
	statementId: string;
}

const initDisplayStatement: DisplayStatement = {
	title: '',
	description: '',
	statementId: '',
};

export default function SimilarStatementsSuggestion({
	setShowModal,
	isQuestion,
	parentStatement,
	isSendToStoreTemp,
	getSubStatements,
}: Readonly<SimilarStatementsSuggestionProps>) {
	const { dir } = useLanguage();
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
			setShowModal={setShowModal}
			
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
						{currentStep === 1 ? (
							<div className={`${dir === 'rtl' ? 'similarities__header__top__stepTwo__rtl' : 'similarities__header__top__stepTwo'}`}>
								<button
									className="similarities__header__top__stepTwo__closeButtonStepTwo"
									onClick={() => setShowModal(false)}
								>
									<CloseIcon />
								</button>
								<img src={illustration01}
									alt='Similarities illustration'
									style={{ width: '40%' }} />
							</div>
						) : (currentStep === 0 || currentStep === 3 ? (
							<div
								className={`${dir === 'rtl' ? 'similarities__header__top__stepOne__rtl' : 'similarities__header__top__stepOne'}`}
							>
								<img
									src={illustration}
									alt='Similarities illustration'
									style={{ width: '89%' }}
								/>
								<button
									className='similarities__header__top__stepOne__closeButtonStepOne'
									onClick={() => setShowModal(false)}
								>
									<CloseIcon />
								</button>
							</div>
						) : (currentStep === 2 ? (
							<div className={`${dir === 'rtl' ? 'similarities__header__top__stepThree__rtl' : 'similarities__header__top__stepThree'}`}>
								<img
									src={illustration02}
									alt='Another illustration'
									style={{ width: '76%' }}
								/>
								<button
									className={`${dir === 'rtl' ? 'similarities__header__top__stepThree__rtl__arrowButtonStepThree' : 'similarities__header__top__stepThree__arrowButtonStepThree'}`}
									onClick={() => setCurrentStep(currentStep - 1)}
								>
									<ArrowLeftIcon />
								</button>
							</div>
						) : null))
						}
						
					</header>
					{renderStep()}
				</main>
			)}
		</FullScreenModal>
	);
}
