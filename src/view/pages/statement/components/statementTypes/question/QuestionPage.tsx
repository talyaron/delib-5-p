import { useContext, useState } from 'react'
import { StatementContext } from '../../../StatementCont'
import styles from './QuestionPage.module.scss'
import Button, { ButtonType } from '@/view/components/buttons/button/Button'
import Modal from '@/view/components/modal/Modal'
import AddStage from './addStage/AddStage'
import { useSelector } from 'react-redux'
import { statementSubsSelector } from '@/model/statements/statementsSlice'
import StageCard from './stages/StageCard'
import { StatementType } from 'delib-npm'

const QuestionPage = () => {
	const { statement } = useContext(StatementContext);
	const stages = useSelector(statementSubsSelector(statement?.statementId)).filter((sub) => sub.statementType === StatementType.stage)

	const [showAddStage, setShowAddStage] = useState(false)

	return (
		<div className={styles.wrapper}>
			<h2>Question</h2>
			<p>{statement?.description}</p>
			<Button text="Add Stage" type="button" buttonType={ButtonType.PRIMARY} onClick={() => setShowAddStage(true)} />
			{showAddStage && <Modal>
				<AddStage setShowAddStage={setShowAddStage} />
			</Modal>}
			<div className={styles.stagesWrapper}>
				{stages && stages.map((stage) => {
					return <StageCard key={stage.statementId} statement={stage} />
				})}
			</div>
		</div>
	)
}

export default QuestionPage