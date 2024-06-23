import React from 'react';
import SendIcon from '../../../../../assets/icons/send-icon-pointing-up-and-right.svg?react';
import TwoColorButton from '../../../../components/buttons/TwoColorButton';

interface SimilarStatementsSuggestionProps {
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	newStatementInput: { title: string; description: string };
	setViewSimilarStatement: React.Dispatch<
		React.SetStateAction<{
			title: string;
			description: string;
		}>
	>;
	similarStatements: { title: string; description: string }[];
}

export default function StepTwoShowSimilarStatements({
	setCurrentStep,
	newStatementInput,
	similarStatements,
	setViewSimilarStatement
}: SimilarStatementsSuggestionProps) {

	const handleViewSimilarStatement = (statement: {
		title: string;
		description: string;
	}) => {
		setViewSimilarStatement(statement);
		setCurrentStep(2);
	};

	const handleSubmit = () => {
		setCurrentStep((prev) => prev + 2);
	};

	return (
		<>
			<h4 className='alertText'>Similar statements already exist. Click to view.</h4>
			<div className='similarities__titleInput'>
				<label htmlFor='titleInput'>Your statement title</label>
				<input
					type='text'
					id='titleInput'
					placeholder='Statement title. What people would see at first sight.'
					value={newStatementInput.title}
					disabled
				/>
			</div>
			<section className='similarities__statementsBox'>
				{similarStatements.map((statement, index) => (
					<div
						key={index}
						className='similarities__statementsBox__similarStatement'
						onClick={() => handleViewSimilarStatement(statement)}
					>
						<h4>{statement.title}</h4>
						<p>{statement.description}</p>
					</div>
				))}
			</section>

			<div className='similarities__buttonBox'>
				<TwoColorButton
					icon={SendIcon}
					text='Continue with your statement'
					textBackgroundColor='#fff'
					textColor='var(--dark-text)'
					iconBackgroundColor='var(--dark-blue)'
					onClick={handleSubmit}
				/>
			</div>
		</>
	);
}
