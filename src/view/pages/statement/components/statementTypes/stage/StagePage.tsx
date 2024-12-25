import { DeliberationType, Statement } from 'delib-npm';
import styles from './StagePage.module.scss';
import SuggestionCards from '../../evaluations/components/suggestionCards/SuggestionCards';

const StagePage = () => {
	return (
		<div className={styles.stage}>
			<h2>Stage</h2>
			<p>Stage description</p>
		</div>
	)
}

export default StagePage

export function StagePageSwitch(statement: Statement) {

	if (statement.statementSettings?.deliberationType === DeliberationType.options) {
		return <SuggestionCards />
	}

}