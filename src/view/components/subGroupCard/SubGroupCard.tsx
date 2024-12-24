import { Statement } from 'delib-npm'
import { FC } from 'react'
import styles from './SubGroupCard.module.scss'
import { Link } from 'react-router-dom';
import useStatementColor from '@/controllers/hooks/useStatementColor';
import useSubGroupCard from './SubGroupVM';



interface Props {
	statement: Statement;
}

const SubGroupCard: FC<Props> = ({ statement }) => {
	const text = statement.statement;
	const { Icon } = useSubGroupCard(statement);

	const { backgroundColor } = useStatementColor({ statement });


	return (

		<Link to={`/statement/${statement.statementId}`} className={styles.card} style={{ border: `1px solid ${backgroundColor}`, borderLeft: `5px solid ${backgroundColor}` }}>
			<div className={styles.text}>{text}</div>
			<div className={styles.iconWrapper} style={{ color: backgroundColor }}>
				{Icon}
			</div>

		</Link>
	)
}

export default SubGroupCard