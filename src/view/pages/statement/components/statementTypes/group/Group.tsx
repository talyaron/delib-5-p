import Button from '@/view/components/buttons/button/Button';
import styles from './Group.module.scss';
import { useContext } from 'react';
import { StatementContext } from '../../../StatementCont';

const Group = () => {
	const { handleSetNewStatement } = useContext(StatementContext);
	function handleAddGroup() {
		handleSetNewStatement(true);
	}
	return (
		<div className={styles.group}>

			<Button text="add group" onClick={handleAddGroup}></Button>
			<Button text="add question" ></Button>
		</div>
	)
}

export default Group