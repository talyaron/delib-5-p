import StatementBottomNav from '../../../nav/bottom/StatementBottomNav'
import styles from './SimpleQuestion.module.scss'
import SuggestionCards from '../../../evaluations/components/suggestionCards/SuggestionCards'



const SimpleQuestion = () => {


	return (
		<div>
			<div className={styles.wrapper}>
				<SuggestionCards />
				<div>
					<StatementBottomNav />
				</div>
			</div>
		</div>
	)
}

export default SimpleQuestion