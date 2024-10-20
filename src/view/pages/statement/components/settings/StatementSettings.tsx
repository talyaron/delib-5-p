import { FC, useEffect, useState } from 'react';

// Third party imports
import { useParams } from 'react-router-dom';
import { Statement } from 'delib-npm';

// Redux Store
import { useAppDispatch, useAppSelector } from '@/controllers/hooks/reduxHooks';
import {
	setStatement,
	statementSelector,
} from '@/model/statements/statementsSlice';

// Hooks & Helpers
import { useLanguage } from '@/controllers/hooks/useLanguages';
import StatementSettingsForm from './components/statementSettingsForm/StatementSettingsForm';
import { listenToMembers } from '@/controllers/db/statements/listenToStatements';
import { getStatementFromDB } from '@/controllers/db/statements/getStatement';
import { defaultEmptyStatement } from './emptyStatementModel';
import { listenToStatementMetaData } from '@/controllers/db/statements/statementMetaData/listenToStatementMeta';

// Custom components
import Loader from '@/view/components/loaders/Loader';

const StatementSettings: FC = () => {
	// * Hooks * //
	const { statementId } = useParams();
	const { t } = useLanguage();

	// * State * //
	const [parentStatement, setParentStatement] = useState<
		Statement | undefined | 'top'
	>(undefined);
	const [isLoading] = useState(false);
	const [statementToEdit, setStatementToEdit] = useState<
		Statement | undefined
	>();

	// * Redux * //
	const dispatch = useAppDispatch();
	const statement: Statement | undefined = useAppSelector(
		statementSelector(statementId)
	);

	// * Use Effect * //
	useEffect(() => {
		try {
			if (statement) {
				setStatementToEdit(statement);

				if (statement.parentId === 'top') {
					setParentStatement('top');

					return;
				}

				//get parent statement
				getStatementFromDB(statement.parentId)
					.then((parentStatement) => {
						try {
							if (!parentStatement) throw new Error('no parent statement');

							setParentStatement(parentStatement);
						} catch (error) {
							console.error(error);
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
		} catch (error) {
			console.error(error);
		}
	}, [statement]);

	useEffect(() => {
		try {
			let unsubscribe: undefined | (() => void);
			let unSubMeta: undefined | (() => void);

			if (statementId) {
				unsubscribe = listenToMembers(dispatch)(statementId);
				unSubMeta = listenToStatementMetaData(statementId);

				if (statement) {
					setStatementToEdit(statement);
				} else {
					(async () => {
						const statementDB = await getStatementFromDB(statementId);
						if (statementDB) {
							dispatch(setStatement(statementDB));
							setStatementToEdit(statementDB);
						}
					})();
				}
			} else {
				setStatementToEdit(defaultEmptyStatement);
			}

			return () => {
				if (unsubscribe) unsubscribe();
				if (unSubMeta) unSubMeta();
			};
		} catch (error) {
			console.error(error);
		}
	}, [statementId]);

	return (
		<main className='page__main'>
			{isLoading || !statementToEdit ? (
				<div className='center'>
					<h2>{t('Updating')}</h2>
					<Loader />
				</div>
			) : (
				<StatementSettingsForm
					statement={statementToEdit}
					parentStatement={parentStatement}
					setStatementToEdit={setStatementToEdit}
				/>
			)}
		</main>
	);
};

export default StatementSettings;
