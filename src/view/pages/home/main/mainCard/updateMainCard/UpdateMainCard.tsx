import { Statement } from 'delib-npm';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/controllers/hooks/reduxHooks';
import {
	setStatement,
	statementSelectorById,
} from '@/model/statements/statementsSlice';
import { getStatementFromDB } from '@/controllers/db/statements/getStatement';
import { Link } from 'react-router-dom';
import { getTitle } from '@/view/components/InfoParser/InfoParserCont';
import { getTime, truncateString } from '@/controllers/general/helpers';

interface Props {
	statement: Statement;
}

const UpdateMainCard: FC<Props> = ({ statement }) => {
	try {
		if (!statement) throw new Error('No statement');
		if (!statement.parentId) throw new Error('No parent id');
		const dispatch = useAppDispatch();
		const parentStatement = useAppSelector(
			statementSelectorById(statement.parentId)
		);

		useEffect(() => {
			if (!parentStatement) {
				getStatementFromDB(statement.parentId).then((st) => {
					if (st) dispatch(setStatement(st));
				});
			}
		}, [parentStatement]);

		const group = parentStatement ? getTitle(parentStatement.statement) : '';
		const text = statement.statement;

		return (
			<Link to={`/statement/${statement.parentId}/chat`}>
				<p>
					{parentStatement ? <span>{truncateString(group)}: </span> : null}
					<span>{truncateString(text, 32)} </span>
					<span className="time">{getTime(statement.lastUpdate)}</span>
				</p>
			</Link>
		);
	} catch (error) {
		console.error(error);

		return null;
	}
};

export default UpdateMainCard;
