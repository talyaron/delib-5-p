import { DeliberativeElement, QuestionStage, QuestionType, Statement, StatementType } from "delib-npm";
import { FC, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { sortSubStatements } from "../../statementsEvaluationCont";
import SuggestionCard from "./suggestionCard/SuggestionCard";
import styles from "./SuggestionCards.module.scss";
import { getFirstEvaluationOptions, getSecondEvaluationOptions } from "@/controllers/db/multiStageQuestion/getMultiStageStatements";
import { statementSubsSelector } from "@/model/statements/statementsSlice";
import { StatementContext } from "@/view/pages/statement/StatementCont";
import EmptyScreen from "../emptyScreen/EmptyScreen";




const SuggestionCards: FC = () => {
	const { sort } = useParams();
	const navigate = useNavigate();
	const { statement } = useContext(StatementContext);

	const [totalHeight, setTotalHeight] = useState(0);

	const { questionType, currentStage } = statement?.questionSettings || { questionType: QuestionType.singleStep, currentStage: QuestionStage.suggestion };
	const subStatements = useSelector(statementSubsSelector(statement?.statementId)).filter((sub: Statement) => sub.statementType === StatementType.option);



	useEffect(() => {
		const { totalHeight: _totalHeight } = sortSubStatements(subStatements, sort, 30);
		setTotalHeight(_totalHeight);
	}, [sort]);
	useEffect(() => {
		if (questionType == QuestionType.multipleSteps) {
			if (currentStage === QuestionStage.firstEvaluation)
				getFirstEvaluationOptions(statement);
			else if (currentStage === QuestionStage.secondEvaluation)
				getSecondEvaluationOptions(statement);
			else if (currentStage === QuestionStage.voting) navigate(`statement/${statement?.statementId}/vote`);
			else if (currentStage === QuestionStage.finished) getSecondEvaluationOptions(statement);

		}
	}, [currentStage, questionType]);

	if (!subStatements) {
		return (
			<EmptyScreen setShowModal={() => { }} />
		);
	}

	useEffect(() => {
		const _totalHeight = subStatements.reduce((acc: number, sub: Statement) => {
			return acc + (sub.elementHight || 200) + 30;
		}
			, 0);
		setTotalHeight(_totalHeight);
		sortSubStatements(subStatements, sort, 30);
	}, [subStatements.length]);

	return (
		<div className={styles["suggestions-wrapper"]} style={{ height: `${totalHeight + 100}px` }}>
			{subStatements?.map((statementSub: Statement) => {
				return (
					<SuggestionCard
						key={statementSub.statementId}
						parentStatement={statement}
						siblingStatements={subStatements}
						statement={statementSub}
					/>
				);
			})}

		</div>
	);
};

export default SuggestionCards;
