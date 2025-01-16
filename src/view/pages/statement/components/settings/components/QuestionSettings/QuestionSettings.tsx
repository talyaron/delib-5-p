import CustomSwitchSmall from "@/view/components/switch/customSwitchSmall/CustomSwitchSmall";
import { StatementType } from "delib-npm";
import { FC } from "react";
import { StatementSettingsProps } from "../../settingsTypeHelpers";
import SectionTitle from "../sectionTitle/SectionTitle";
// import QuestionDashboard from "./questionDashboard/QuestionDashboard";
// import QuestionStageRadioBtn from "./QuestionStageRadioBtn/QuestionStageRadioBtn";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import "./QuestionSettings.scss";
// import { setQuestionType } from "@/controllers/db/statements/statementMetaData/setStatementMetaData";

//icons
import DocumentIcon from "@/assets/icons/document.svg?react";
import SimpleIcon from "@/assets/icons/navQuestionsIcon.svg?react";
// import StepsIcon from "@/assets/icons/stepsIcon.svg?react";
// import StepsNoIcon from "@/assets/icons/stepsNoIcon.svg?react";
import { setStatementSettingToDB } from "@/controllers/db/statementSettings/setStatementSettings";

const QuestionSettings: FC<StatementSettingsProps> = ({
	statement,
	// setStatementToEdit,
}) => {
	try {
		const { t } = useLanguage();
		const { questionSettings } = statement;
		// const isMultistepes = questionSettings?.questionType === QuestionType.multipleSteps;

		if (statement.statementType !== StatementType.question) return null;

		function handleSetDocumentQuestion(isDocument: boolean) {
			console.log(isDocument);
			setStatementSettingToDB({
				statement,
				property: "isDocument",
				newValue: isDocument,
				settingsSection: "questionSettings",
			});
		}

		return (
			<div className="question-settings">
				<SectionTitle title="Question Settings" />

				<CustomSwitchSmall
					label="Document Question"
					checked={questionSettings?.isDocument || false}
					setChecked={handleSetDocumentQuestion}
					textChecked={t("Document Question")}
					imageChecked={<DocumentIcon />}
					imageUnchecked={<SimpleIcon />}
					textUnchecked={t("Simple Question")}
				/>

				{/* <CustomSwitchSmall
					label="Multi-Stage Question"
					checked={isMultistepes}
					setChecked={_setChecked}
					textChecked={t(QuestionType.multipleSteps)}
					textUnchecked={t(QuestionType.singleStep)}
					imageChecked={<StepsIcon />}
					imageUnchecked={<StepsNoIcon />}
				/>

				<div className="question-settings__wrapper">
					<div className="question-settings-dashboard">
						<QuestionDashboard statement={statement} />
					</div>
					{questionSettings?.steps && (
						<>
							<QuestionStageRadioBtn
								stage={QuestionStage.explanation}
								statement={statement}
							/>
							<QuestionStageRadioBtn
								stage={QuestionStage.suggestion}
								statement={statement}
							/>
							<QuestionStageRadioBtn
								stage={QuestionStage.firstEvaluation}
								statement={statement}
							/>
							<QuestionStageRadioBtn
								stage={QuestionStage.secondEvaluation}
								statement={statement}
							/>
							<QuestionStageRadioBtn
								stage={QuestionStage.voting}
								statement={statement}
							/>
							<QuestionStageRadioBtn
								stage={QuestionStage.finished}
								statement={statement}
							/>
						</>
					)}
				</div> */}
			</div>
		);

		// function _setChecked() {

		// 	const questionType = checked
		// 		? QuestionType.singleStep
		// 		: QuestionType.multipleSteps;
		// 	const currentStage: QuestionStage =
		// 		statement.questionSettings?.currentStage || QuestionStage.suggestion;

		// 	setChecked(!checked);

		// 	setQuestionType({
		// 		statementId: statement.statementId,
		// 		type: questionType,
		// 		stage: currentStage,
		// 	});
		// 	setStatementToEdit({
		// 		...statement,
		// 		questionSettings: {
		// 			...statement.questionSettings,
		// 			questionType,
		// 			currentStage,
		// 		},
		// 	});
		// }
	} catch (error: unknown) {
		console.error(error);

		return <p>{(error as Error).message}</p>;
	}
};

export default QuestionSettings;
