import { Statement, User } from "delib-npm";
import { FC } from "react";
import StatementEvaluationCard from "../StatementSolutionCard";
import styles from "./SuggestionCards.module.scss";

interface Props {
  statement: Statement;
  sortedSubStatements: Statement[];
  handleShowTalker: (talker: User | null) => void;
}

const SuggestionCards: FC<Props> = ({
  statement,
  sortedSubStatements,
  handleShowTalker,
}) => {
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
