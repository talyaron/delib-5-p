import { SimpleStatement, Statement } from 'delib-npm'
import { FC } from 'react'
import styles from './StageCard.module.scss';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { Link } from 'react-router-dom';


interface Props {
	statement: Statement
}

const StageCard: FC<Props> = ({ statement }) => {

	const chosen = statement.results || []


	function suggestNewSuggestion(ev: any) {
		ev.stopPropagation()
	}

	return (
		<div className={styles.card}>
			<h4>{statement.statement}</h4>

			<p>No suggestion so far</p>
			<Link to={`/statement/${statement.statementId}`}><p>See more...</p></Link>
			<h5>Selected Options</h5>
			<ul>
				{chosen.map((opt: SimpleStatement) => (
					<li key={opt.parentId}>{opt.statement}{opt.description ? ":" : ""} {opt.description}</li>
				))}
			</ul>
			<div className="btns">
				<Button text="Add Suggestion" buttonType={ButtonType.SECONDARY} onClick={suggestNewSuggestion} />
			</div>
		</div>
	)
}

export default StageCard