import { Statement } from 'delib-npm'
import { FC } from 'react'
import styles from './SubGroupCard.module.scss'
import { Link } from 'react-router-dom';

interface Props {
	statement: Statement;
}

const SubGroupCard: FC<Props> = ({ statement }) => {



	return (
		<Link to={`/statement/${statement.statementId}`} className={styles.card}>
			<p>{statement.statement}</p>
		</Link>
	)
}

export default SubGroupCard