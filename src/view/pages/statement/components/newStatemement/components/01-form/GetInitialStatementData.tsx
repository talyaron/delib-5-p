import { useLanguage } from '@/controllers/hooks/useLanguages';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { useContext } from 'react';
import { NewStatementContext } from '../../newStatementCont';
import { StatementContext } from '@/view/pages/statement/StatementCont';
import Input from '@/view/components/input/Input';
import Textarea from '@/view/components/textarea/Textarea';




export default function GetInitialStatementData() {
	const { t } = useLanguage();
	const { title, description, setTitle, setDescription } = useContext(NewStatementContext);
	const { newStatementType, handleSetNewStatement } = useContext(StatementContext);
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
				<Input label="כותרת ההצעה" placeholder="שם הקבוצה החדשה" value={title} />
				<Textarea label="תיאור ההצעה" placeholder="תיאור הקבוצה החדשה" value={description} />
				<Button type='submit' text={t('Continue')} buttonType={ButtonType.PRIMARY} />
				<Button text={t('Cancel')} buttonType={ButtonType.SECONDARY} onClick={() => handleSetNewStatement(false)} />
			</form>

		</>
	);
}
