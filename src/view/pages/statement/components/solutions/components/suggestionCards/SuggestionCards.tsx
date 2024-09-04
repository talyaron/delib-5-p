import { QuestionStage, QuestionType, Statement, User } from "delib-npm";
import { FC, useEffect } from "react";
import SuggestionCard from "./suggestionCard/SuggestionCard";
import styles from "./SuggestionCards.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  myStatementsByStatementIdSelector,
  statementsOfMultiStepSelectorByStatementId,
  statementSubsSelector,
} from "@/model/statements/statementsSlice";
import EmptyScreen from "../emptyScreen/EmptyScreen";
import { sortSubStatements } from "../../statementSolutionsCont";
import { getFirstEvaluationOptions, getSecondEvaluationOptions } from "@/controllers/db/multiStageQuestion/getMultiStageStatements";

interface Props {
  statement: Statement;
  questions: boolean;
  handleShowTalker: (talker: User | null) => void;
  currentPage?: string;
  setShowModal: (show: boolean) => void;
}

const SuggestionCards: FC<Props> = ({
  statement,
  handleShowTalker,
  currentPage = `suggestion`,
  setShowModal,
}) => {
  const { sort } = useParams();

  const {questionType ,currentStage} = statement.questionSettings || {questionType: QuestionType.singleStep, currentStage: QuestionStage.suggestion};
  const subStatements = switchSubStatements() ;

  function switchSubStatements(){
    if(questionType === QuestionType.singleStep) return useSelector(
      statementSubsSelector(statement.statementId)
    )
    else if(questionType === QuestionType.multipleSteps && currentStage !== QuestionStage.suggestion) return useSelector(statementsOfMultiStepSelectorByStatementId(statement.statementId));
    else if(questionType === QuestionType.multipleSteps && currentStage === QuestionStage.suggestion) return useSelector(myStatementsByStatementIdSelector(statement.statementId));
    else return [];
  }
  
  useEffect(() => { 
    sortSubStatements(subStatements, sort, 30);
  },[sort]);
  useEffect(() => {
    if(questionType == QuestionType.multipleSteps){
      if(currentStage === QuestionStage.firstEvaluation)
        getFirstEvaluationOptions(statement);
      else if(currentStage === QuestionStage.secondEvaluation)
        getSecondEvaluationOptions(statement);
   
    }
  }, [currentStage, questionType]);


  if (!subStatements) {
    return (
      <EmptyScreen currentPage={currentPage} setShowModal={setShowModal} />
    );
  }

  return (
    <div className={styles["suggestions-wrapper"]}>
      {subStatements?.map((statementSub: Statement) => {
        return (
          <SuggestionCard
            key={statementSub.statementId}
            parentStatement={statement}
            siblingStatements={subStatements}
            statement={statementSub}
            showImage={handleShowTalker}
          />
        );
      })}
  
    </div>
  );
};

export default SuggestionCards;
