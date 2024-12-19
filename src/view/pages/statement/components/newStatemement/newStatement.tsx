import { useState } from 'react';


import './newStatement.scss';


import GetInitialStatementData from './components/01-form/GetInitialStatementData';


import { NewStatementContext } from './newStatementCont';



export interface DisplayStatement {
	title: string;
	description: string;
	statementId: string;
}



export default function newStatement() {

	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0);



	return (
		<NewStatementContext.Provider value={{ title, setTitle, description, setDescription, setCurrentStep }}>
			{CurrenScreen(currentStep)}
		</NewStatementContext.Provider>
	)

	function CurrenScreen(currentStep: 0 | 1 | 2 | 3 | 4): JSX.Element {
		switch (currentStep) {
			case 0:
				return (<GetInitialStatementData />);
			default:
				return <>Error: Could't fins the step</>;
		}
	}


	// const stepsComponents = [
	// 	<GetInitialStatementData
	// 		key={0}
	// 		statementId={parentStatement.statementId}
	// 		setCurrentStep={setCurrentStep}
	// 		setShowModal={setShowModal}
	// 		newStatementInput={newStatementInput}
	// 		setNewStatementInput={setNewStatementInput}
	// 		setSimilarStatements={setSimilarStatements}
	// 		onFormSubmit={onFormSubmit}
	// 	/>,
	// 	<StepTwoShowSimilarStatements
	// 		key={1}
	// 		setCurrentStep={setCurrentStep}
	// 		newStatementInput={newStatementInput}
	// 		similarStatements={similarStatements}
	// 		setViewSimilarStatement={setViewSimilarStatement}
	// 		setShowModal={setShowModal}

	// 	/>,
	// 	<StepThreeViewSimilarStatement
	// 		key={2}
	// 		setCurrentStep={setCurrentStep}
	// 		viewSimilarStatement={viewSimilarStatement}
	// 		setShowModal={setShowModal}

	// 	/>,
	// 	<StepFourContinueWithOwnInput
	// 		key={3}
	// 		setCurrentStep={setCurrentStep}
	// 		newStatementInput={newStatementInput}
	// 		onFormSubmit={onFormSubmit}
	// 	/>,
	// ];

	// const renderStep = () => {
	// 	return stepsComponents[currentStep];
	// };

	// return (
	// 	<FullScreenModal>
	// 		{isLoading ? (
	// 			<Loader />
	// 		) : (
	// 			<main className='similarities'>
	// 				<header className='similarities__header'>
	// 					{currentStep === 1 ? (
	// 						<div className={`${dir === 'rtl' ? 'similarities__header__top__stepTwo__rtl' : 'similarities__header__top__stepTwo'}`}>
	// 							<button
	// 								className="similarities__header__top__stepTwo__closeButtonStepTwo"
	// 								onClick={() => setShowModal(false)}
	// 							>
	// 								<CloseIcon />
	// 							</button>
	// 							<img src={illustration01}
	// 								alt='Similarities illustration'
	// 								style={{ width: '40%' }} />
	// 						</div>
	// 					) : (currentStep === 0 || currentStep === 3 ? (
	// 						<div
	// 							className={`${dir === 'rtl' ? 'similarities__header__top__stepOne__rtl' : 'similarities__header__top__stepOne'}`}
	// 						>
	// 							<img
	// 								src={illustration}
	// 								alt='Similarities illustration'
	// 								style={{ width: '89%' }}
	// 							/>
	// 							<button
	// 								className='similarities__header__top__stepOne__closeButtonStepOne'
	// 								onClick={() => setShowModal(false)}
	// 							>
	// 								<CloseIcon />
	// 							</button>
	// 						</div>
	// 					) : (currentStep === 2 ? (
	// 						<div className={`${dir === 'rtl' ? 'similarities__header__top__stepThree__rtl' : 'similarities__header__top__stepThree'}`}>
	// 							<img
	// 								src={illustration02}
	// 								alt='Another illustration'
	// 								style={{ width: '76%' }}
	// 							/>
	// 							<button
	// 								className={`${dir === 'rtl' ? 'similarities__header__top__stepThree__rtl__arrowButtonStepThree' : 'similarities__header__top__stepThree__arrowButtonStepThree'}`}
	// 								onClick={() => setCurrentStep(currentStep - 1)}
	// 							>
	// 								<ArrowLeftIcon />
	// 							</button>
	// 						</div>
	// 					) : null))
	// 					}

	// 				</header>
	// 				{renderStep()}
	// 			</main>
	// 		)}
	// 	</FullScreenModal>
	// );
}
