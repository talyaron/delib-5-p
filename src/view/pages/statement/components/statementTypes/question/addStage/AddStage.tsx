import { FC } from 'react';
import { useLanguage } from '@/controllers/hooks/useLanguages'
import styles from './AddStage.module.scss'
import Button, { ButtonType } from '@/view/components/buttons/button/Button'


interface AddStageProps {
	setShowAddStage: (showAddStage: boolean) => void
}

const AddStage: FC<AddStageProps> = ({ setShowAddStage }) => {
	const { t } = useLanguage()

	function handleCloseModal() {
		setShowAddStage(false)
	}

	return (
		<div className={styles.box}>
			<form>
				<select name="stageType" id="stageType" defaultValue="">
					<option value="">{t("Select Stage Type")}</option>
					<option value="3">{t("Needs")}</option>
					<option value="1">{t("Explanation")}</option>
					<option value="2">{t("Research Questions")}</option>
					<option value="4">{t("Hypothesis")}</option>
					<option value="5">{t("Suggestions")}</option>
					<option value="6">{t("Conclusion")}</option>
					<option value="8">{t("Summery")}</option>
					<option value="7">{t("Other")}</option>

				</select>
				<label htmlFor="stageName">{t("Stage Name")}</label>
				<input type="text" id="stageName" name="stageName" placeholder={t("Stage Name")} />
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