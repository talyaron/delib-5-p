import { Statement, StatementType } from 'delib-npm';
import { FC } from 'react';
import Text from '@/view/components/text/Text';
import StatementChatMore from '@/view/pages/statement/components/chat/components/StatementChatMore';
import { Link } from 'react-router-dom';
import './ResultsNode.scss';
import { styleSwitch } from './ResultsNodeCont';

interface Props {
	statement: Statement;
	resultsType: StatementType[];
}
export const ResultsNode: FC<Props> = ({ statement }) => {
	return (
		<div className={styleSwitch(statement)}>
			<Link
				state={{
					from: window.location.pathname,
				}}
				to={`/statement/${statement.statementId}/chat`}
			>
				<Text statement={statement.statement} />

				<StatementChatMore statement={statement} />
			</Link>
		</div>
	);
};
