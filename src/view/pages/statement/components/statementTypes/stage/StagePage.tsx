import { DeliberationType, Statement, StatementType } from 'delib-npm';
import styles from './StagePage.module.scss';
import SuggestionCards from '../../evaluations/components/suggestionCards/SuggestionCards';
import StatementVote from '../../vote/StatementVote';
import { useContext } from 'react';
import { StatementContext } from '../../../StatementCont';
import Button from '@/view/components/buttons/button/Button';

const StagePage = () => {
	const { statement, handleSetNewStatement, setNewStatementType } = useContext(StatementContext);

	function handleCreateNewOption() {
		setNewStatementType(StatementType.option);
		handleSetNewStatement(true);
	}

	return (
		<div className={styles.stage}>
			<h2>Stage</h2>
			<p>Stage description</p>
			<StagePageSwitch statement={statement} />
			<Button text="Add suggestion" onClick={handleCreateNewOption} />
		</div>
	)
}

export default StagePage

interface StagePageSwitchProps {
	statement: Statement | undefined
}

export function StagePageSwitch({ statement }: StagePageSwitchProps) {

	if (!statement) return null

	if (statement.statementSettings?.deliberationType === DeliberationType.options) {
		return <SuggestionCards />
	} else if (statement.statementSettings?.deliberationType === DeliberationType.voting) {
		return <StatementVote />
	} else {
		return <SuggestionCards />
	}

}