import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '@/assets/icons/send-icon-pointing-up-and-right.svg?react';
import Loader from '@/view/components/loaders/Loader';
import { findSimilarStatements } from '@/controllers/db/statements/getSimilarstatements';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import { subStatementsSelector } from '../../../../StatementMain';
import { RootState } from '@/model/store';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { DisplayStatement } from '../../newStatement';



export default function GetInitialStatementData() {
	const { t } = useLanguage();
	const [isLoading, setIsLoading] = useState(false);
	const titleInputRef = useRef<HTMLInputElement>(null);



	const handleSubmit = async () => {
	};

	return (
		<>
			<h4 className='similarities__title'>{t('Compose your suggestion')}</h4>
			<div className='similarities__titleInput'>
				<label htmlFor='titleInput'>{t('Title')}</label>
				<input
					ref={titleInputRef}
					type='text'
					id='titleInput'
					placeholder={t(
						'Suggestion title. What people would see at first sight'
					)}
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
						<label htmlFor='descriptionInput'>{t('Description')}</label>
						<textarea
							className='similarities__titleInput'
							rows={5}
							id='descriptionInput'
							placeholder={t(
								'Formulate here the description. Add as much detail as you can to help others understand your suggestion'
							)}
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
						<Button
							icon={<SendIcon />}
							text={t('Submit Suggestion')}
							buttonType={ButtonType.PRIMARY}
							onClick={(e) => {
								e.preventDefault();
								handleSubmit();
							}}
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