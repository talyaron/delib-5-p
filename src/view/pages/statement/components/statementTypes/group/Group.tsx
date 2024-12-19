import Button from '@/view/components/buttons/button/Button';
import styles from './Group.module.scss';
import { useContext } from 'react';
import { StatementContext } from '../../../StatementCont';
import { StatementType } from 'delib-npm';

const Group = () => {
	const { handleSetNewStatement, setNewStatementType } = useContext(StatementContext);

	function handleAddStatement(newStatementType: StatementType) {
		setNewStatementType(newStatementType);
		handleSetNewStatement(true);
	}

	return (
		<div className={styles.group}>

			<Button text="add group" onClick={() => handleAddStatement(StatementType.group)}></Button>
			<Button text="add question" onClick={() => handleAddStatement(StatementType.question)}></Button>
		</div>
	)
}

export default Group