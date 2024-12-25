import { Statement } from 'delib-npm'
import { FC } from 'react'
import styles from './StageCard.module.scss';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';


interface Props {
	statement: Statement
}

const StageCard: FC<Props> = ({ statement }) => {
	return (
		<div className={styles.card}>
			<h4>{statement.statement}</h4>

			<p>No suggestion so far</p>
			<div className="btns">
				<Button text="Add Suggestion" buttonType={ButtonType.SECONDARY} />
			</div>
		</div>
	)
}

export default StageCard