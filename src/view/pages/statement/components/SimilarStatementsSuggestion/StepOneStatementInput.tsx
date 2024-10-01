import React, { useState } from 'react';
import SendIcon from '@/assets/icons/send-icon-pointing-up-and-right.svg?react';
import Loader from '@/view/components/loaders/Loader';
import { findSimilarStatements } from '@/controllers/db/statements/getSimilarstatements';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import { subStatementsSelector } from '../../StatementMain';
import { RootState } from '@/model/store';
import SubmitStatementButton from './SubmitStatementButton';

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
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	statementId: string;
}

export default function StepOneStatementInput({
	setCurrentStep,
	newStatementInput,
	setNewStatementInput,
	statementId,
	setSimilarStatements,
	setShowModal,
	onFormSubmit,
}: Readonly<SimilarStatementsSuggestionProps>) {
	const [isLoading, setIsLoading] = useState(false);

	const subStatements = useAppSelector((state: RootState) =>
		subStatementsSelector(state, statementId)
	);

	const handleSubmit = async () => {
		if (!newStatementInput.title || newStatementInput.title.length < 5) {
			return;
		}
		setIsLoading(true);

		// Search for similar statements
		const similarStatementsIds = await findSimilarStatements(
			statementId,
			newStatementInput.title
		);

		const getSubStatements = subStatements
			.filter((subStatement) =>
				similarStatementsIds.includes(subStatement.statementId)
			)
			.map((subState) => {
				const arrayOfStatementParagraphs =
					subState?.statement.split('\n') || [];
				const title = removeNonAlphabeticalCharacters(
					arrayOfStatementParagraphs[0]
				);

				// Get all elements of the array except the first one
				const description = removeNonAlphabeticalCharacters(
					arrayOfStatementParagraphs.slice(1).join('\n')
				);

				return {
					title,
					description,
				};
			});

		if (getSubStatements.length === 0) {
			onFormSubmit();
		}

		setSimilarStatements(getSubStatements);

		setCurrentStep((prev) => prev + 1);
		setIsLoading(false);
	};

	return (
		<>
			<h4 className='similarities__title'>Compose your solution</h4>
			<div className='similarities__titleInput'>
				<label htmlFor='titleInput'>Your statement title</label>
				<input
					autoFocus
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
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSubmit();
						}
					}}
				/>
			</div>
			{isLoading ? (
				<>
					<p>Search for similar suggestions...</p>
					<Loader />
				</>
			) : (
				<>
					<div className='similarities__titleInput'>
						<label htmlFor='descriptionInput'>Your statement description</label>
						<textarea className='similarities__titleInput'
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
						<SubmitStatementButton
							icon={SendIcon}
							text='Submit Statement'
							textColor='var(--white)'
							onClick={handleSubmit}
						/>
						<Button
							text={t('Cancel')}
							buttonType={ButtonType.SECONDARY}
							onClick={() => setShowModal(false)}
						/>
					</div>
				</>
			)}
		</>
	);
}

function removeNonAlphabeticalCharacters(input: string) {
	return input.replace(/[^a-zA-Z ]/g, '');
}

