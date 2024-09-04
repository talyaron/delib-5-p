import { QuestionType, Statement, User } from "delib-npm";
import { FC, useEffect, useState } from "react";
import StatementEvaluationCard from "./suggestionCard/SuggestionCard";
import styles from "./SuggestionCards.module.scss";
import { getSubStatements, sortSubStatements } from "../../statementSolutionsCont";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  myStatementsByStatementIdSelector,
  statementSubsSelector,
} from "@/model/statements/statementsSlice";
import EmptyScreen from "../emptyScreen/EmptyScreen";

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
  questions,
  currentPage = `suggestion`,
  setShowModal,
}) => {
  const { sort } = useParams();
  const subStatements = useSelector(
    statementSubsSelector(statement.statementId)
  );

  const [wrapperHeight, setWrapperHeight] = useState(0);

  
  useEffect(() => { 
    sortSubStatements(subStatements, sort, 30);
  },[sort]);

  useEffect(() => {
    if (subStatements) {
      const height = subStatements.reduce((acc, statement:Statement) => acc + (statement.top ||0), 0);
      setWrapperHeight(height);
    }
  }, [subStatements]);

  if (!subStatements) {
    return (
      <EmptyScreen currentPage={currentPage} setShowModal={setShowModal} />
    );
  }

  return (
    <div className={styles["suggestions-wrapper"]}>
      {subStatements?.map((statementSub: Statement) => {
        return (
          <StatementEvaluationCard
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
