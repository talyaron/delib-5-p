import React from 'react';
import SendIcon from '@/assets/icons/send-icon-pointing-up-and-right.svg?react';
import SubmitStatementButton from './SubmitStatementButton';

interface StepThreeViewSimilarStatementProps {
	viewSimilarStatement: { title: string; description: string };
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function StepThreeViewSimilarStatement({
	viewSimilarStatement,
	setCurrentStep,
	setShowModal,
}: Readonly<StepThreeViewSimilarStatementProps>) {
	const handleSimilarStatementChosen = () => {
		setShowModal(false);
	};

	return (
		<>
			<h4 className='alertText'>
				One of the relevant statements from the given topic:
			</h4>
			<p className='similarities__statementsBox__statementTitle'>{viewSimilarStatement.title}</p>
			<p className='similarities__statementsBox__statementDescription'>{viewSimilarStatement.description}</p>
			<div className='twoButtonBox'>
				<button
					className='twoButtonBox__backButton'
					onClick={() => setCurrentStep((prev) => prev - 1)}
				>Back</button>
				<SubmitStatementButton
					icon={SendIcon}
					text='Choose this solution'
					textColor='var(--white)'
					onClick={handleSimilarStatementChosen}
				/>
			</div>
		</>
	);
}
