import { Statement, StatementType } from 'delib-npm';
import { ReactNode, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StatementContext } from '../../StatementCont';
import Chat from '../chat/Chat';
import FollowMeToast from '../followMeToast/FollowMeToast';
import StatementSettings from '../settings/StatementSettings';
import GroupPage from '../statementTypes/group/GroupPage';
import styles from './Switch.module.scss';
import QuestionPage from '../statementTypes/question/QuestionPage';
import StagePage from '../statementTypes/stage/StagePage';
import { useSwitchMV } from './SwitchMV';

const Switch = () => {
	const { statement } = useContext(StatementContext);
	const { parentStatement } = useSwitchMV();

	return (
		<main className='page__main'>
			<FollowMeToast />
			<div className={styles.inner}>
				<div className={styles.header}>
					<h1>{statement?.statementType === StatementType.stage ? parentStatement?.statement : statement?.statement}</h1>
				</div>
				<div
					className={styles.main}
				>
					<div className={styles.statement}>
						<SwitchScreen statement={statement} />
					</div>
				</div>
			</div>
		</main>
	);
};

interface SwitchScreenProps {
	statement: Statement | undefined;
}

function SwitchScreen({ statement }: SwitchScreenProps): ReactNode {
	const { screen } = useParams();
	switch (screen) {
		case 'chat':
			return <Chat />;
		case 'settings':
			return <StatementSettings />;
		case "main":
			return <SwitchStatementType statement={statement} />;
		default:
			return <SwitchStatementType statement={statement} />;
	}
}

function SwitchStatementType({ statement }: { statement: Statement | undefined }): ReactNode {

	const statementType = statement?.statementType;

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
			return null;
	}
}

export default Switch;
