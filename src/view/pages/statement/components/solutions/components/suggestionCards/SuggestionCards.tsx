import { Statement, User } from "delib-npm";
import { FC, useEffect } from "react";
import StatementEvaluationCard from "./suggestionCard/SuggestionCard";
import styles from "./SuggestionCards.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  statementSubsSelector,
} from "@/model/statements/statementsSlice";
import EmptyScreen from "../emptyScreen/EmptyScreen";
import { sortSubStatements } from "../../statementSolutionsCont";

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
  const subStatements = useSelector(
    statementSubsSelector(statement.statementId)
  );

  
  useEffect(() => { 
    sortSubStatements(subStatements, sort, 30);
  },[sort]);


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
