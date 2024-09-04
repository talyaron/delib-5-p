import { QuestionType, Statement, User } from "delib-npm";
import { FC, useContext, useEffect } from "react";
import StatementEvaluationCard from "../StatementSolutionCard";
import styles from "./SuggestionCards.module.scss";
import { getSubStatements } from "../../statementSolutionsCont";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { myStatementsByStatementIdSelector } from "@/model/statements/statementsSlice";
import { SubStatementsContext } from "../../statementSolutionPageContext";

interface Props {
  statement: Statement;
  subStatements: Statement[];
  questions: boolean;
  handleShowTalker: (talker: User | null) => void;
}

const SuggestionCards: FC<Props> = ({
  statement,
  subStatements,
  handleShowTalker,
  questions,
}) => {
  const { sort } = useParams();
  const isMultiStage =
    statement.questionSettings?.questionType === QuestionType.multipleSteps;
  const myStatements = useSelector(
    myStatementsByStatementIdSelector(statement.statementId)
  );

  const { sortedSubStatements, setSortedSubStatements } =
    useContext(SubStatementsContext);

  useEffect(() => {
    setSortedSubStatements(subStatements);
  }, []);



  useEffect(() => {
    getSubStatements({
      statement,
      subStatements,
      sort,
      questions,
      myStatements,
    }).then((_subStatements) => {
      setSortedSubStatements(_subStatements);
    });
  }, [sort,subStatements]);

  // Variables
  let topSum = 30;
  const tops: number[] = [topSum];

  console.log(topSum, tops);

  return (
    <div className={styles["suggestions-wrapper"]}>
      {sortedSubStatements?.map((statementSub: Statement, i: number) => {
        //get the top of the element
        if (statementSub.elementHight) {
          topSum += statementSub.elementHight + 30;
          tops.push(topSum);
        }

        return (
          <StatementEvaluationCard
            key={statementSub.statementId}
            parentStatement={statement}
            statement={statementSub}
            showImage={handleShowTalker}
            top={tops[i]}
          />
        );
      })}
      <div
        className="options__bottom"
        style={{ height: `${topSum + 70}px` }}
      ></div>
    </div>
  );
};

export default SuggestionCards;
