import { DeliberativeElement, QuestionStage, QuestionType, Statement } from "delib-npm";
import { FC, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { sortSubStatements } from "../../statementsEvaluationCont";
import EmptyScreen from "../emptyScreen/EmptyScreen";
import SuggestionCard from "./suggestionCard/SuggestionCard";
import styles from "./SuggestionCards.module.scss";
import { getFirstEvaluationOptions, getSecondEvaluationOptions } from "@/controllers/db/multiStageQuestion/getMultiStageStatements";
import {
	myStatementsByStatementIdSelector,
	statementsOfMultiStepSelectorByStatementId,
	statementSubsSelector,
} from "@/model/statements/statementsSlice";
import { StatementContext } from "@/view/pages/statement/StatementCont";



const SuggestionCards: FC = () => {
	const { sort } = useParams();
	const navigate = useNavigate();
	const { statement } = useContext(StatementContext);

	const [totalHeight, setTotalHeight] = useState(0);

	const { questionType, currentStage } = statement?.questionSettings || { questionType: QuestionType.singleStep, currentStage: QuestionStage.suggestion };
	const subStatements = switchSubStatements().filter((sub) => sub.deliberativeElement === DeliberativeElement.option);;

	//change the source of options from the store based on the question type
	function switchSubStatements() {
		if (questionType === QuestionType.singleStep) return useSelector(
			statementSubsSelector(statement?.statementId)
		)
		else if (questionType === QuestionType.multipleSteps && currentStage !== QuestionStage.suggestion) return useSelector(statementsOfMultiStepSelectorByStatementId(statement?.statementId));
		else if (questionType === QuestionType.multipleSteps && currentStage === QuestionStage.suggestion) return useSelector(myStatementsByStatementIdSelector(statement?.statementId));
		else return [];
	}

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

	// if (!subStatements) {
	// 	return (
	// 		<EmptyScreen currentPage={currentPage} setShowModal={() => { })} />
	// 	);
	// }

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
