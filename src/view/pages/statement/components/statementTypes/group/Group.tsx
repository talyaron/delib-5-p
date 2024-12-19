import Button from '@/view/components/buttons/button/Button';
import styles from './Group.module.scss';
import { useContext } from 'react';
import { StatementContext } from '../../../StatementCont';
import { StatementType } from 'delib-npm';
import { useSelector } from 'react-redux';
import { statementSubsSelector } from '@/model/statements/statementsSlice';

const Group = () => {
	const { handleSetNewStatement, setNewStatementType, statement } = useContext(StatementContext);
	const subStatements = useSelector(statementSubsSelector(statement?.statementId));
	const subGroups = subStatements.filter(sub => sub.statementType === StatementType.group);
	const subQuestions = subStatements.filter(sub => sub.statementType === StatementType.question);

	function handleAddStatement(newStatementType: StatementType) {
		setNewStatementType(newStatementType);
		handleSetNewStatement(true);
	}

	return (
		<div className={styles.group}>
			<h4>Group</h4>
			{subGroups.map(sub => <p key={sub.statementId}>{sub.statement}</p>)}
			<h4>Questions</h4>
			{subQuestions.map(sub => <p key={sub.statementId}>{sub.statement}</p>)}
			<div className="btns">
				<Button text="add group" onClick={() => handleAddStatement(StatementType.group)}></Button>
				<Button text="add question" onClick={() => handleAddStatement(StatementType.question)}></Button>
			</div>
		</div>
	)
}

export default Group