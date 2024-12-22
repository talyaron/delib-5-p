import { statementSubsSelector } from '@/model/statements/statementsSlice';
import Button from '@/view/components/buttons/button/Button';
import { StatementType } from 'delib-npm';
import { useContext } from 'react'
import { useSelector } from 'react-redux';
import { StatementContext } from '../../../StatementCont';
import "./groupPage.scss"
import AddButton from './AddButton';

export default function GroupPage() {
	const { handleSetNewStatement, setNewStatementType, statement } = useContext(StatementContext);
	const subStatements = useSelector(statementSubsSelector(statement?.statementId));
	const subGroups = subStatements.filter(sub => sub.statementType === StatementType.group);
	const subQuestions = subStatements.filter(sub => sub.statementType === StatementType.question);

	function handleAddStatement(newStatementType: StatementType) {
		setNewStatementType(newStatementType);
		handleSetNewStatement(true);
	}

	return (
		<div className="groupPage">
			<h4>Group</h4>
			{subGroups.map(sub => <p key={sub.statementId}>{sub.statement}</p>)}
			<h4>Questions</h4>
			{subQuestions.map(sub => <p key={sub.statementId}>{sub.statement}</p>)}
			{/* <div className="btns">
				<Button text="add group" onClick={() => handleAddStatement(StatementType.group)}></Button>
				<Button text="add question" onClick={() => handleAddStatement(StatementType.question)}></Button>
			</div> */}
			<AddButton />
		</div>
	)
}
