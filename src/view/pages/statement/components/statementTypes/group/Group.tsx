import Button from '@/view/components/buttons/button/Button';
import styles from './Group.module.scss';
import { useContext } from 'react';
import { StatementContext } from '../../../StatementCont';

const Group = () => {
	const { statement } = useContext(StatementContext);
	return (
		<div className={styles.group}>
			{statement?.description && <p>{statement.description}</p>}
			<Button text="add group" ></Button>
			<Button text="add question" ></Button>
		</div>
	)
}

export default Group