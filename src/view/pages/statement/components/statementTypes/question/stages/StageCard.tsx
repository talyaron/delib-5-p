import { Statement } from 'delib-npm'
import { FC } from 'react'
import styles from './StageCard.module.scss';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { Link } from 'react-router-dom';


interface Props {
	statement: Statement
}

const StageCard: FC<Props> = ({ statement }) => {

	function suggestNewSuggestion(ev: any) {
		ev.stopPropagation()
		console.log("Suggest new suggestion")
	}

	return (
		<div className={styles.card}>
			<h4>{statement.statement}</h4>

			<p>No suggestion so far</p>
			<Link to={`/statement/${statement.statementId}`}><p>See more...</p></Link>
			<div className="btns">
				<Button text="Add Suggestion" buttonType={ButtonType.SECONDARY} onClick={suggestNewSuggestion} />
			</div>
		</div>
	)
}

export default StageCard