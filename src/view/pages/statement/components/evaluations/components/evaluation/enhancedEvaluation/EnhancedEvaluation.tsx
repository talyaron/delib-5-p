import { Statement } from "delib-npm";
import { FC } from "react";

import { setEvaluationToDB } from "@/controllers/db/evaluation/setEvaluation";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { evaluationSelector } from "@/model/evaluations/evaluationsSlice";
import {
	enhancedEvaluationsThumbs,
	EnhancedEvaluationThumb,
} from "./EnhancedEvaluationModel";
import { getEvaluationThumbIdByScore } from "../../../statementsEvaluationCont";
import styles from  "./EnhancedEvaluation.module.scss";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { userSettingsSelector } from "@/model/users/userSlice";
import { decreesUserSettingsLearningRemain } from "@/controllers/db/learning/setLearning";

interface EnhancedEvaluationProps {
  statement: Statement;
  shouldDisplayScore: boolean;
}

const EnhancedEvaluation: FC<EnhancedEvaluationProps> = ({
	statement,
	shouldDisplayScore,
}) => {
	const evaluationScore = useAppSelector(
		evaluationSelector(statement.statementId)
	);

	const learningEvaluation =
    useAppSelector(userSettingsSelector)?.learning?.evaluation || 0;
	const { t } = useLanguage();

	const { sumPro, sumCon, numberOfEvaluators } = statement.evaluation || {
		sumPro: 0,
		sumCon: 0,
		numberOfEvaluators: 0,
	};
	

	return (
		<div
			className={styles[`enhanced-evaluation`]}
			// className={styles[`enhanced-evaluation] ${dir === "ltr" ? "mirrorReverse" : ""}`]}
		>
			<div className={styles["evaluation-score"]}>
				{shouldDisplayScore === true ? sumCon : null}
			</div>
			<div
				className={styles["evaluation-thumbs"]}
			>
				{enhancedEvaluationsThumbs.map((evaluationThumb) => (
					<EvaluationThumb
						key={evaluationThumb.id}
						evaluationThumb={evaluationThumb}
						evaluationScore={evaluationScore}
						statement={statement}
					/>
				))}
			</div>

			{shouldDisplayScore ? (
				<div
					className={`${styles[`evaluation-score`]} ${statement.consensus < 0 ? "negative" : ""}`}
				>
					<span>{sumPro}</span>
					{(numberOfEvaluators && numberOfEvaluators > 0)? (
						<span className={styles["total-evaluators"]}> ({numberOfEvaluators})</span>
					):null}
					
				</div>
			) : (
				<div />
			)}
			<div />
			{learningEvaluation > 0 && (
				<div className={styles["evaluation-explain"]}>					
					<span>{t("Disagree")}</span>	
					<span>{t("Agree")}</span>				
				</div>
			)}
			<div />
		</div>
	);
};

export default EnhancedEvaluation;

interface EvaluationThumbProps {
  statement: Statement;
  evaluationScore: number | undefined;
  evaluationThumb: EnhancedEvaluationThumb;
}

const EvaluationThumb: FC<EvaluationThumbProps> = ({
	evaluationThumb,
	evaluationScore,
	statement,
}) => {
	const handleSetEvaluation = (): void => {
		setEvaluationToDB(statement, evaluationThumb.evaluation);
		decreesUserSettingsLearningRemain({ evaluation: true });
	};

	const isThumbActive =
    evaluationScore !== undefined &&
    evaluationThumb.id === getEvaluationThumbIdByScore(evaluationScore);

	return (
		<button
			className={`${styles["evaluation-thumb"]} ${isThumbActive ? styles.active : ""}`}
			style={{
				backgroundColor: isThumbActive
					? evaluationThumb.colorSelected
					: evaluationThumb.color,
			}}
			onClick={handleSetEvaluation}
		>
			<img src={evaluationThumb.svg} alt={evaluationThumb.alt} />
		</button>
	);
};
