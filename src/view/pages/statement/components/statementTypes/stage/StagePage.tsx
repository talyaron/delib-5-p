import { DeliberationType, Statement, StatementType } from 'delib-npm';
import { useContext, useEffect, useRef } from 'react';
import { StatementContext } from '../../../StatementCont';
import Button from '@/view/components/buttons/button/Button';
import SuggestionCards from '../../evaluations/components/suggestionCards/SuggestionCards';
import StatementVote from '../../vote/StatementVote';
import styles from './StagePage.module.scss'

const StagePage = () => {
	const { statement, handleSetNewStatement, setNewStatementType } = useContext(StatementContext);
	const stageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateHeight = () => {
			if (stageRef.current) {
				const topPosition = stageRef.current.getBoundingClientRect().top;
				const viewportHeight = window.innerHeight;
				const newHeight = viewportHeight - topPosition;
				stageRef.current.style.height = `${newHeight}px`;
			}
		};

		// Initial height calculation
		updateHeight();

		// Update height on window resize
		window.addEventListener('resize', updateHeight);

		return () => {
			window.removeEventListener('resize', updateHeight);
		};
	}, []);

	function handleCreateNewOption() {
		setNewStatementType(StatementType.option);
		handleSetNewStatement(true);
	}

	return (
		<div
			ref={stageRef}
			className={styles.stage}
		>
			<div className={styles.wrapper}>
				<h2 className="text-2xl font-bold mb-2">Stage</h2>
				<p className="mb-4">Stage description</p>
				<StagePageSwitch statement={statement} />
				<Button text="Add suggestion" onClick={handleCreateNewOption} />
			</div>
		</div>
	);
};

export default StagePage;

interface StagePageSwitchProps {
	statement: Statement | undefined;
}

export function StagePageSwitch({ statement }: StagePageSwitchProps) {
	if (!statement) return null;

	if (statement.statementSettings?.deliberationType === DeliberationType.options) {
		return <SuggestionCards />;
	} else if (statement.statementSettings?.deliberationType === DeliberationType.voting) {
		return <StatementVote />;
	} else {
		return <SuggestionCards />;
	}
}