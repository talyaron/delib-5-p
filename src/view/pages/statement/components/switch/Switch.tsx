import { Statement, StatementType } from 'delib-npm';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StatementContext } from '../../StatementCont';

import FollowMeToast from '../followMeToast/FollowMeToast';
import StatementSettings from '../settings/StatementSettings';
import GroupPage from '../statementTypes/group/GroupPage';
import QuestionPage from '../statementTypes/question/QuestionPage';
import StagePage from '../statementTypes/stage/StagePage';

const Switch = () => {
	const { statement } = useContext(StatementContext);

	return (
		<main className='page__main'>
			<FollowMeToast />
			<SwitchInner statement={statement} />
		</main>
	);
};

function SwitchInner({ statement }: { statement: Statement | undefined }) {

	const { command } = useParams();
	const statementType = statement?.statementType;

	if (command === 'settings') {
		return <StatementSettings />;
	}

	switch (statementType) {
		case StatementType.group:
			return (
				<GroupPage />
			);
		case StatementType.question:
			return (
				<QuestionPage />
			);
		case StatementType.stage:
			return (
				<StagePage />
			);
		default:
			return (
				<p>StatementType is unrecognized</p>
			);
	}
}


export default Switch;
