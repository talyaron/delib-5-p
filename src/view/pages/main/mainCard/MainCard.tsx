import { Statement } from 'delib-npm';
import { FC } from 'react';
import Text from '../../../components/text/Text';

import StatementChatMore from '../../statement/components/chat/components/StatementChatMore';
import { Link } from 'react-router-dom';
import './MainCard.scss';

interface Props {
	statement: Statement;
}

const MainCard: FC<Props> = ({ statement }) => {
	return (
		<div className='main-card' style={{ borderColor: statement.color }}>
			<Link to={`/statement/${statement.statementId}/chat`}>
				<Text text={statement.statement} />
				<StatementChatMore statement={statement} />
			</Link>
		</div>
	);
};

export default MainCard;
