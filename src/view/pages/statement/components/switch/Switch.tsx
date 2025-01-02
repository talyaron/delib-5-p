import { Statement, StatementType } from 'delib-npm';
import { ReactNode, useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatementContext } from '../../StatementCont';
import Chat from '../chat/Chat';
import FollowMeToast from '../followMeToast/FollowMeToast';
import StatementSettings from '../settings/StatementSettings';
import GroupPage from '../statementTypes/group/GroupPage';
import styles from './Switch.module.scss';
import QuestionPage from '../statementTypes/question/QuestionPage';
import StagePage from '../statementTypes/stage/StagePage';

const Switch = () => {
	const { statement } = useContext(StatementContext);

	return (
		<main className='page__main'>
			<FollowMeToast />
			<div className={styles.inner}>
				<div className={styles.header}>
					<h1>{statement?.statement}</h1>
				</div>
				<div
					className={styles.main}
				>
					<div className={styles.statement}>
						<SwitchInner statement={statement} />
					</div>
				</div>
			</div>
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

				<p>test</p>

			);
	}
}

interface StatementInnerProps {
	children: ReactNode;
}

function StatementInner({ children }: StatementInnerProps) {
	let scrollPosition: number | undefined = undefined;
	const navigate = useNavigate();
	const scrollableRef = useRef<HTMLDivElement>(null);
	const { statement } = useContext(StatementContext);
	const { command } = useParams();

	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		//Use for scrolling between chat and main and changing the url accordingly
		const scrollLeft = event.currentTarget.scrollLeft;
		if (scrollPosition) {
			if (scrollLeft > scrollPosition) {
				navigate(`/statement/${statement?.statementId}/main`);
			} else if (scrollLeft < scrollPosition) {
				navigate(`/statement/${statement?.statementId}/chat`);
			} else {
				navigate(`/statement/${statement?.statementId}/main`);
			}
		}
		scrollPosition = scrollLeft;
	};

	useEffect(() => {
		if (command === 'chat' && scrollableRef.current) {
			scrollableRef.current.scrollTo(-window.innerWidth, 0);
		} else {
			scrollableRef.current?.scrollTo(0, 0);
		}
	}, [command]);

	useEffect(() => {
		scrollPosition = 0;
	}, [statement?.statementId]);

	return (
		<div className={styles.inner}>
			<div className={styles.header}>
				<h1>{statement?.statement}</h1>
			</div>
			<div
				className={styles.main}
				ref={scrollableRef}
				onScrollCapture={handleScroll}
			>
				<div className={styles.statement}>
					{children}
				</div>
			</div>
		</div>
	);
}

export default Switch;
