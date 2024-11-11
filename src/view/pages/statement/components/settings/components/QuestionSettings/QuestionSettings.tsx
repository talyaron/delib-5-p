import { FC, useState, useEffect } from 'react';
import SectionTitle from '../sectionTitle/SectionTitle';
import { StatementSettingsProps } from '../../settingsTypeHelpers';
import CustomSwitchSmall from '@/view/components/switch/customSwitchSmall/CustomSwitchSmall';
import { QuestionStage, QuestionType, StatementType } from 'delib-npm';
import QuestionDashboard from './questionDashboard/QuestionDashboard';
import QuestionStageRadioBtn from './QuestionStageRadioBtn/QuestionStageRadioBtn';
import { useLanguage } from '@/controllers/hooks/useLanguages';

import './QuestionSettings.scss';
import { setQuestionType } from '@/controllers/db/statements/statementMetaData/setStatementMetaData';

const QuestionSettings: FC<StatementSettingsProps> = ({
	statement,
	setStatementToEdit,
}) => {
	try {
		const { t } = useLanguage();
		const [checked, setChecked] = useState(false);
		const isMuliStage =
			statement.questionSettings?.questionType === QuestionType.multipleSteps;

		useEffect(() => {
			if (!statement.questionSettings) {
				setChecked(false);

				return;
			}
			const isChecked =
				statement.questionSettings?.questionType === QuestionType.multipleSteps
					? true
					: false;
			setChecked(isChecked);
		}, [statement.questionSettings]);

		if (statement.statementType !== StatementType.question) return null;

		return (
			<div className="question-settings">
				<SectionTitle title="Question Settings" />
				<CustomSwitchSmall
					label="Multi-Stage Question"
					checked={checked}
					setChecked={_setChecked}
					textChecked={t(QuestionType.multipleSteps)}
					textUnchecked={t(QuestionType.singleStep)}
				/>

				<div className="question-settings__wrapper">
					<div className="question-settings-dashboard">
						<QuestionDashboard statement={statement} />
					</div>
					{isMuliStage && (
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
				</div>
			</div>
		);

		function _setChecked() {
			const questionType = checked
				? QuestionType.singleStep
				: QuestionType.multipleSteps;
			const currentStage: QuestionStage =
				statement.questionSettings?.currentStage || QuestionStage.suggestion;

			setChecked(!checked);

			setQuestionType({
				statementId: statement.statementId,
				type: questionType,
				stage: currentStage,
			});
			setStatementToEdit({
				...statement,
				questionSettings: {
					...statement.questionSettings,
					questionType,
					currentStage,
				},
			});
		}
	} catch (error: unknown) {
		console.error(error);

		return <p>{(error as Error).message}</p>;
	}
};

export default QuestionSettings;
