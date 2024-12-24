import { Statement } from 'delib-npm'
import { FC } from 'react'
import styles from './SubGroupCard.module.scss'
import { Link } from 'react-router-dom';

interface Props {
	statement: Statement;
}

const SubGroupCard: FC<Props> = ({ statement }) => {
	const text = statement.statement;


	return (

		<Link to={`/statement/${statement.statementId}`} className={styles.card}>
			<div className={styles.text}>{text}</div>
			<div className={styles.iconWrapper}>
				{/* <img src={iconSrc} alt="group icon" className={styles.icon} /> */}
			</div>

		</Link>
	)
}

export default SubGroupCard