import React, { useState } from 'react';
import SendIcon from '@/assets/icons/send-icon-pointing-up-and-right.svg?react';
import Loader from '@/view/components/loaders/Loader';
import { findSimilarStatements } from '@/controllers/db/statements/getSimilarstatements';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import { subStatementsSelector } from '../../StatementMain';
import { RootState } from '@/model/store';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { DisplayStatement } from './SimilarStatementsSuggestion';

interface SimilarStatementsSuggestionProps {
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	newStatementInput: DisplayStatement;
	setNewStatementInput: React.Dispatch<
		React.SetStateAction<DisplayStatement>
	>;
	setSimilarStatements: React.Dispatch<
		React.SetStateAction<DisplayStatement[]>
	>;
	onFormSubmit: () => void;
	statementId: string;
}

export default function StepOneStatementInput({
	setCurrentStep,
	newStatementInput,
	setNewStatementInput,
	statementId,
	setSimilarStatements,
	onFormSubmit,
}: Readonly<SimilarStatementsSuggestionProps>) {
	const {t} = useLanguage();
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
				

				return {
					statementId: subState.statementId,
					title: subState.statement,
					description: subState.description || '',
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
			<h4 className='similarities__title'>{t("Compose your suggestion")}</h4>
			<div className='similarities__titleInput'>
				<label htmlFor='titleInput'>{t("Title")}</label>
				<input
					autoFocus
					type='text'
					id='titleInput'
					placeholder={t('Suggestion title. What people would see at first sight') }
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
						<label htmlFor='descriptionInput'>{t("Description")}</label>
						<textarea className='similarities__titleInput'
							rows={5}
							id='descriptionInput'
							placeholder={t('Formulate here the description. Add as much detail as you can to help others understand your suggestion')}
							defaultValue={newStatementInput.description}
							onChange={(e) =>
								setNewStatementInput({
									...newStatementInput,
									description: e.target.value,
								})
							}
						/>
					</div>
					<div className='similarities__buttonBox'>
						<Button
							icon={<SendIcon />}
							text={t('Submit Suggestion')}
							buttonType={ButtonType.PRIMARY}
							onClick={(e) => { e.preventDefault(); handleSubmit(); }}
						/>
					</div>
				</>
			)}
		</>
	);
}


