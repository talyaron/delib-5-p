import React, { useState } from 'react';
import SendIcon from '../../../../../assets/icons/send-icon-pointing-up-and-right.svg?react';
import TwoColorButton from '../../../../components/buttons/TwoColorButton';
import Loader from '../../../../components/loaders/Loader';
import { findSimilarStatements } from '../../../../../controllers/db/statements/getSimilarstatements';

interface SimilarStatementsSuggestionProps {
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	newStatementInput: { title: string; description: string };
	setNewStatementInput: React.Dispatch<
		React.SetStateAction<{ title: string; description: string }>
	>;
	setSimilarStatements: React.Dispatch<
		React.SetStateAction<{ title: string; description: string }[]>
	>;
	onFormSubmit: () => void;
}

export default function StepOneStatementInput({
	// setCurrentStep,
	newStatementInput,
	setNewStatementInput,

	// setSimilarStatements,
	// onFormSubmit,
}: SimilarStatementsSuggestionProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		setIsLoading(true);

		// Search for similar statements
		const getStatements = await findSimilarStatements(
			'123',
			newStatementInput.title
		);
		console.log(getStatements);

		// if (getStatements.length === 0) {
		// 	onFormSubmit();
		// }

		// setSimilarStatements(getStatements);

		// setCurrentStep((prev) => prev + 1);
		// setIsLoading(false);
	};

	return (
		<>
			<h4 className='similarities__title'>Compose your question</h4>
			<div className='similarities__titleInput'>
				<label htmlFor='titleInput'>Your statement title</label>
				<input
					type='text'
					id='titleInput'
					placeholder='Statement title. What people would see at first sight.'
					value={newStatementInput.title}
					onChange={(e) =>
						setNewStatementInput({
							...newStatementInput,
							title: e.target.value,
						})
					}
				/>
			</div>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className='similarities__titleInput'>
						<label htmlFor='descriptionInput'>Your statement description</label>
						<textarea
							rows={5}
							id='descriptionInput'
							placeholder='Formulate here the statement description. Add as much detail as you can to help others understand your statement.'
							value={newStatementInput.description}
							onChange={(e) =>
								setNewStatementInput({
									...newStatementInput,
									description: e.target.value,
								})
							}
						/>
					</div>

					<div className='similarities__buttonBox'>
						<TwoColorButton
							icon={SendIcon}
							text='Submit Statement'
							textBackgroundColor='#fff'
							textColor='var(--dark-text)'
							iconBackgroundColor='var(--dark-blue)'
							onClick={handleSubmit}
						/>
					</div>
				</>
			)}
		</>
	);
}
