import { FC, useContext, useState } from 'react';
import { useLanguage } from '@/controllers/hooks/useLanguages'
import styles from './AddStage.module.scss'
import Button, { ButtonType } from '@/view/components/buttons/button/Button'
import { StageType, StatementType } from 'delib-npm';
import { saveStatementToDB } from '@/controllers/db/statements/setStatements';
import { StatementContext } from '@/view/pages/statement/StatementCont';


interface AddStageProps {
	setShowAddStage: (showAddStage: boolean) => void
}

const AddStage: FC<AddStageProps> = ({ setShowAddStage }) => {
	const { t } = useLanguage()
	const { statement } = useContext(StatementContext)


	const [defaultStageName, setDefaultStageName] = useState<string>("")
	const [userEnteredStageName, setUserEnteredStageName] = useState<boolean>(false)

	function handleCloseModal() {
		setShowAddStage(false)
	}

	function handleChangeStageName(ev: any) {
		if (userEnteredStageName) return;
		const stageType = ev.target.value as StageType;
		const stageName = getDefaultStageName(stageType)
		setDefaultStageName(stageName)
	}

	function handleManualStageName() {
		setUserEnteredStageName(true)
	}

	function handleSubmit(ev: any) {
		ev.preventDefault()
		const data = new FormData(ev.target)
		const stageType = data.get("stageType") as StageType
		const name = data.get("stageName") as string
		const description = data.get("stageDescription") as string || ""


		if (!statement || !stageType) return;
		saveStatementToDB({ text: name, description, stageType, parentStatement: statement, statementType: StatementType.stage })
	}

	return (
		<div className={styles.box}>
			<form onSubmit={handleSubmit}>
				<select name="stageType" id="stageType" defaultValue="" onChange={handleChangeStageName}>
					<option value="" disabled>{t("Select Stage Type")}</option>
					<option value={StageType.needs}>{t("Needs")}</option>
					<option value={StageType.explanation}>{t("Explanation")}</option>
					<option value={StageType.questions}>{t("Research Questions")}</option>
					<option value={StageType.hypothesis}>{t("Hypothesis")}</option>
					<option value={StageType.suggestions}>{t("Suggestions")}</option>
					<option value={StageType.conclusion}>{t("Conclusion")}</option>
					<option value={StageType.summary}>{t("Summery")}</option>
					<option value={StageType.other}>{t("Other")}</option>
				</select>
				<label htmlFor="stageName">{t("Stage Name")}</label>
				<input type="text" id="stageName" name="stageName" placeholder={t("Stage Name")} defaultValue={defaultStageName} onKeyUp={handleManualStageName} required />
				<label htmlFor="stageDescription">{t("Stage Description")}</label>
				<textarea id="stageDescription" name="stageDescription" placeholder={t("Stage Description")} />
				<div className="btns">
					<Button text={t("Add Stage")} type="submit" buttonType={ButtonType.PRIMARY} />
					<Button text={t("Cancel")} type="reset" buttonType={ButtonType.SECONDARY} onClick={handleCloseModal} />
				</div>
			</form>
		</div>
	)
}

export default AddStage

function getDefaultStageName(stageType: StageType): string {
	switch (stageType) {
		case StageType.needs:
			return "Needs"
		case StageType.explanation:
			return "Explanation"
		case StageType.questions:
			return "Research Questions"
		case StageType.hypothesis:
			return "Hypothesis"
		case StageType.suggestions:
			return "Suggestions"
		case StageType.conclusion:
			return "Conclusion"
		case StageType.summary:
			return "Summery"
		case StageType.other:
			return "Other"
		default:
			return ""
	}
}