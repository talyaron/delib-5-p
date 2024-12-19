import { ReactNode, useContext, useEffect, useRef } from 'react';
import { StatementContext } from '../../StatementCont';
import FollowMeToast from '../followMeToast/FollowMeToast';
import { useParams } from 'react-router-dom';
import { Screen, Statement, StatementType } from 'delib-npm';
import StatementSettings from '../settings/StatementSettings';
import styles from './Switch.module.scss';

import Chat from '../chat/Chat';
import Group from '../statementTypes/group/Group';

const Switch = () => {
	const { statement } = useContext(StatementContext);

	console.log(useParams());

	return (
		<main className='page__main'>
			<FollowMeToast />
			<SwitchInner statement={statement} />
		</main>
	);
};

function SwitchInner({
	statement,
}: {
	statement: Statement | undefined;
}) {
	const { command } = useParams();
	const statementType = statement?.statementType;
	console.log(command);
	if (command === "settings") {
		return <StatementSettings />;
	}

	switch (statementType) {
		case StatementType.group:
			return (
				<StatementInner>
					<Group />
				</StatementInner>
			);
		default:
			return (
				<StatementInner>
					<p>test</p>
				</StatementInner>
			);
	}
}

interface StatementInnerProps {
	children: ReactNode;
}

function StatementInner({ children }: StatementInnerProps) {
	const scrollableRef = useRef<HTMLDivElement>(null);
	const { statement } = useContext(StatementContext);
	const { page } = useParams();

	useEffect(() => {
		if (page === Screen.CHAT && scrollableRef.current) {
			// Use window.innerWidth instead of div width for consistent scrolling
			scrollableRef.current.scrollTo(-window.innerWidth, 0);
		}
	}, [page]);

	return (
		<div className={styles.inner}>
			<div className={styles.header}>
				<h1>{statement?.statement}</h1>
			</div>
			<div className={styles.main} ref={scrollableRef}>
				<div className={styles.statement}>
					<p className='page__description'>{statement?.description}</p>
					{children}
				</div>

				<Chat />

			</div>
		</div>
	);
}

export default Switch;
