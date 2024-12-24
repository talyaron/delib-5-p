import { statementSubsSelector } from '@/model/statements/statementsSlice';
import Button from '@/view/components/buttons/button/Button';
import { StatementType } from 'delib-npm';
import { useContext } from 'react'
import { useSelector } from 'react-redux';
import { StatementContext } from '../../../StatementCont';
import "./groupPage.scss"
import AddButton from './AddButton';
import SubGroupCard from '@/view/components/subGroupCard/SubGroupCard';

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

			<h4>Groups</h4>
			{subGroups.map(sub => <SubGroupCard key={sub.statementId} statement={sub} />)}
			<h4>Questions</h4>
			{subQuestions.map(sub => <SubGroupCard key={sub.statementId} statement={sub} />)}
			<div className="btns">
				<Button text="add group" onClick={() => handleAddStatement(StatementType.group)}></Button>
				<Button text="add question" onClick={() => handleAddStatement(StatementType.question)}></Button>
			</div>
			<AddButton />

		</div>
	)
}
