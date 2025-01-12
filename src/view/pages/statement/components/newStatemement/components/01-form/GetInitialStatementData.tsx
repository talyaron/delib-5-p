import { Statement, StatementType } from 'delib-npm';
import { useContext } from 'react';
import { NewStatementContext } from '../../newStatementCont';
import styles from './GetInitialStatementData.module.scss';
import { createStatement, setStatementToDB } from '@/controllers/db/statements/setStatements';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import Input from '@/view/components/input/Input';
import Textarea from '@/view/components/textarea/Textarea';
import { StatementContext } from '@/view/pages/statement/StatementCont';

export default function GetInitialStatementData() {

	const { t } = useLanguage();
	const { title, description, setTitle, setDescription } = useContext(NewStatementContext);
	const { newStatementType, handleSetNewStatement, statement } = useContext(StatementContext);

	const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		try {
			const form = new FormData(ev.target as HTMLFormElement);
			const title = form.get('title') as string;
			const description = form.get('description')?.toString() || '';
			setTitle(title.toString());
			setDescription(description);

			if (!statement) throw new Error('Statement is not defined');

			const newStatement: Statement | undefined = createStatement({
				parentStatement: statement,
				text: title,
				description,
				statementType: newStatementType,
			});
			if (!newStatement) throw new Error('newStatement is not defined');

			setStatementToDB({
				parentStatement: statement,
				statement: newStatement,
				addSubscription: true,
			});

			handleSetNewStatement(false);

		} catch (error) {
			console.error(error);

		}
	};

	const { title: titleLabel, description: descriptionLabel, placeholder } = getTexts(newStatementType);

	return (
		<>
			<h4>{t('Compose your suggestion')}</h4>
			<p>{newStatementType}</p>
			<form className={styles.form} onSubmit={handleSubmit}>
				<Input label={titleLabel} placeholder={titleLabel} value={title} name="title" />
				<Textarea label={descriptionLabel} placeholder={placeholder} value={description} name="description" />
				<div className="btns">
					<Button type='submit' text={t('Create')} buttonType={ButtonType.PRIMARY} />
					<Button text={t('Cancel')} buttonType={ButtonType.SECONDARY} onClick={() => handleSetNewStatement(false)} />
				</div>
			</form>

		</>
	);
}

function getTexts(statementType: StatementType): { title: string, description: string, placeholder: string } {
	try {
		switch (statementType) {
			case StatementType.group:
				return { title: "Group Title", description: 'Group Description', placeholder: 'Describe the group' }
			case StatementType.question:
				return { title: 'Question Title', description: 'Question Description', placeholder: 'Describe the question' }
			default:
				return { title: 'Title', description: 'Description', placeholder: 'Description' }
		}
	}
	catch (error) {
		console.error(error);

		return { title: 'Title', description: 'Description', placeholder: 'Description' }
	}
}
