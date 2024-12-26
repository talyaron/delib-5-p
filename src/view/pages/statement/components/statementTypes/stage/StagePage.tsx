import { DeliberationType, Statement } from 'delib-npm';
import styles from './StagePage.module.scss';
import SuggestionCards from '../../evaluations/components/suggestionCards/SuggestionCards';
import StatementVote from '../../vote/StatementVote';
import { useContext, useState } from 'react';
import { StatementContext } from '../../../StatementCont';
import Button from '@/view/components/buttons/button/Button';
import Modal from '@/view/components/modal/Modal';
import NewStatement from '../../newStatemement/newStatement';

const StagePage = () => {
	const { statement } = useContext(StatementContext);
	const [showModal, setShowModal] = useState(false);

	function closeModal() {
		setShowModal(false);
	}

	return (
		<div className={styles.stage}>
			<h2>Stage</h2>
			<p>Stage description</p>
			<StagePageSwitch statement={statement} />
			<Button text="Add suggestion" onClick={() => setShowModal(true)} />
			{showModal && <Modal closeModal={closeModal}>
				<NewStatement />
			</Modal>}
		</div>
	)
}

export default StagePage

interface StagePageSwitchProps {
	statement: Statement | undefined
}

export function StagePageSwitch({ statement }: StagePageSwitchProps) {

	if (!statement) return null

	if (statement.statementSettings?.deliberationType === DeliberationType.options) {
		return <SuggestionCards />
	} else if (statement.statementSettings?.deliberationType === DeliberationType.voting) {
		return <StatementVote />
	} else {
		return <SuggestionCards />
	}

}