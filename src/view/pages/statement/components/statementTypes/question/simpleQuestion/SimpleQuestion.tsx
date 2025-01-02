import StatementBottomNav from '../../../nav/bottom/StatementBottomNav'
import styles from './SimpleQuestion.module.scss'
import SuggestionCards from '../../../evaluations/components/suggestionCards/SuggestionCards'



const SimpleQuestion = () => {


	return (
		<div className={styles.simpleQuestion}>
			<div className={styles.wrapper}>

				<SuggestionCards />

				<div className={styles.bottomNav}>
					<StatementBottomNav />
				</div>
			</div>
		</div>
	)
}

export default SimpleQuestion