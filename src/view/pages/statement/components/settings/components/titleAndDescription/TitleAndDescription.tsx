import { FC, useEffect, useRef } from 'react';

// Hooks & Helpers
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { StatementSettingsProps } from '../../settingsTypeHelpers';
import './TitleAndDescription.scss';
import VisuallyHidden from '@/view/components/accessibility/toScreenReaders/VisuallyHidden';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { useNavigate } from 'react-router-dom';

const TitleAndDescription: FC<StatementSettingsProps> = ({
	statement,
	setStatementToEdit,
}) => {
	const { t } = useLanguage();
	const navigate = useNavigate();

	// * Variables * //
	const arrayOfStatementParagraphs = statement?.statement.split('\n') || [];
	const title = arrayOfStatementParagraphs[0];

	const description = arrayOfStatementParagraphs.slice(1).join('\n');

	const titleInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (titleInputRef.current) {
			titleInputRef.current.focus();
		}
	}, []);

	return (
		<div className='title-and-description'>
			<label htmlFor='statement-title'>
				<VisuallyHidden labelName={t('Group Title')}></VisuallyHidden>
				<input
					id='statement-title'
					data-cy='statement-title'
					ref={titleInputRef}
					type='text'
					name='statement'
					placeholder={t('Group Title')}
					value={title}
					onChange={(e) => {
						const newTitle = e.target.value;
						setStatementToEdit({
							...statement,
							statement: `${newTitle}\n${description}`,
						});
					}}
					required={true}
				/>
			</label>
			<label htmlFor='statement-description'>
				<VisuallyHidden labelName={t('Group Description')}></VisuallyHidden>
				<textarea
					id='statement-description'
					name='description'
					placeholder={t('Group Description')}
					rows={3}
					defaultValue={statement.description}
					onChange={(e) => {
						const newDescription = e.target.value;
						setStatementToEdit({
							...statement,
							description: newDescription,
						});
					}}
				/>
			</label>
			<div className='btns'>
				<Button
					text={t('Save')}
					aria-label='Submit button'
					data-cy='settings-statement-submit-btn'
					type='submit'
				/>
				<Button
					text={t('Cancel')}
					type='button'
					buttonType={ButtonType.SECONDARY}
					aria-label='Cancel button'
					data-cy='settings-statement-cancel-btn'
					onClick={() => navigate('/home')}
				/>
			</div>
		</div>
	);
};

export default TitleAndDescription;
