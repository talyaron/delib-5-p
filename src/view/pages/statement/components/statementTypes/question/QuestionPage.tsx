import { useContext, useState } from 'react'
import { StatementContext } from '../../../StatementCont'
import styles from './QuestionPage.module.scss'
import Button, { ButtonType } from '@/view/components/buttons/button/Button'
import Modal from '@/view/components/modal/Modal'
import AddStage from './addStage/AddStage'
import { useSelector } from 'react-redux'
import { statementSubsSelector } from '@/model/statements/statementsSlice'
import StageCard from './stages/StageCard'
import { StageType, Statement, StatementType } from 'delib-npm'
import { createStatement } from '@/controllers/db/statements/setStatements'

const QuestionPage = () => {
	const { statement } = useContext(StatementContext);
	const stages = useSelector(statementSubsSelector(statement?.statementId)).filter((sub) => sub.statementType === StatementType.stage)
	const _stages = createStages({ stages, statement: statement as Statement })
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
				{_stages.map((stage) => {
					return <StageCard key={stage.statementId} statement={stage} />
				})}
			</div>
		</div>
	)
}

export default QuestionPage

function createStages({ stages, statement }: { stages: Statement[], statement: Statement }): Statement[] {
	try {
		const stagesTypes = [StageType.explanation, StageType.needs, StageType.questions, StageType.suggestions, StageType.summary]

		const newStages = stagesTypes.map((stageType) => {
			const existStage = stages.find((stage) => stage.stageType === stageType)
			const isStageExist = existStage !== undefined
			if (!isStageExist) {
				const newStage = new StageC(statement, stageType)
				return newStage.getStage
			}
			return existStage
		})
		return newStages
	} catch (error) {
		console.error(error);
		return []

	}

}

class StageC {
	private stage: Statement | undefined;
	constructor(statement: Statement, stageType: StageType) {
		try {
			const newStage = createStatement({
				text: "",
				description: "",
				statementType: StatementType.stage,
				parentStatement: statement,
				stageType: stageType
			})
			if (!newStage) throw new Error("Could not create stage")
			this.stage = newStage;
		} catch (error) {
			console.error(error);
		}
	}

	get getStage() {
		return this.stage;
	}
}