import { useLanguage } from '@/controllers/hooks/useLanguages';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { useContext } from 'react';
import { NewStatementContext } from '../../newStatementCont';
import { StatementContext } from '@/view/pages/statement/StatementCont';
import Input from '@/view/components/input/Input';




export default function GetInitialStatementData() {
	const { t } = useLanguage();
	const { title, description, setTitle, setDescription } = useContext(NewStatementContext);
	const { newStatementType } = useContext(StatementContext);
	const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		try {
			const form = new FormData();
			const title = form.get('titleInput') as string;
			const description = form.get('descriptionInput') as string;
			setTitle(title);
			setDescription(description);

		} catch (error) {
			console.error(error);

		}
	};

	return (
		<>
			<h4>{t('Compose your suggestion')}</h4>
			<p>{newStatementType}</p>
			<form className='similarities__titleInput' onSubmit={handleSubmit}>
				<Input label="כותרת ההצעה" placeholder="שם הקבוצה החדשה" />
				<div className='similarities__titleInput'>
					<label htmlFor='descriptionInput'>{t('Description')}</label>
					<textarea
						className='similarities__titleInput'
						rows={5}
						id='descriptionInput'
						placeholder={t(
							'Formulate here the description. Add as much detail as you can to help others understand your suggestion'
						)}
						defaultValue={description}

					/>
				</div>
				<Button type='submit' text={t('Continue')} buttonType={ButtonType.PRIMARY} />
				<Button text={t('Cancel')} buttonType={ButtonType.SECONDARY} />
			</form>

		</>
	);
}
