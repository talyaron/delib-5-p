import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement, StatementType, User, isOptionFn } from "delib-npm";
import { useParams } from "react-router";

// Utils & Helpers
import { sortSubStatements } from "./statementSolutionsCont";

// Custom Components
import StatementEvaluationCard from "./components/StatementEvaluationCard";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";
import StatementBottomNav from "../nav/bottom/StatementBottomNav";

interface StatementSolutionsPageProps {
  statement: Statement;
  subStatements: Statement[];
  handleShowTalker: (talker: User | null) => void;
  showNav?: boolean;
  questions?: boolean;
  toggleAskNotifications: () => void;
}

const StatementSolutionsPage: FC<StatementSolutionsPageProps> = ({
  statement,
  subStatements,
  handleShowTalker,
  questions = false,
  toggleAskNotifications,
}) => {
  try {
    // Hooks
    const { sort } = useParams();

    // Use States
    const [showModal, setShowModal] = useState(false);
    const [sortedSubStatements, setSortedSubStatements] = useState<Statement[]>(
      [...subStatements]
    );

    useEffect(() => {
      const _sortedSubStatements = sortSubStatements(
        subStatements,
        sort
      ).filter((subStatement) => {
        //if questions is true, only show questions
        if (questions) {
          return subStatement.statementType === StatementType.question;
        }

        //if options is true, only show options
        return isOptionFn(subStatement);
      });

      setSortedSubStatements(_sortedSubStatements);
    }, [sort, subStatements]);

    useEffect(() => {
      console.log("current stage", statement.questionSettings?.currentStage);
    }, [statement.questionSettings?.currentStage]);

	useEffect(() => {
		console.log("question type", statement.questionSettings?.questionType);
	  }, [statement.questionSettings?.questionType]);

    // Variables
    let topSum = 30;
    const tops: number[] = [topSum];

    return (
      <>
        <div className="page__main">
          <div className="wrapper">
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
        </div>

        <div className="page__footer">
          <StatementBottomNav
            setShowModal={setShowModal}
            statement={statement}
          />
        </div>
        {showModal && (
          <CreateStatementModal
            parentStatement={statement}
            isOption={questions ? false : true}
            setShowModal={setShowModal}
            toggleAskNotifications={toggleAskNotifications}
          />
        )}
      </>
    );
  } catch (error) {
    console.error(error);

    return null;
  }
};

export default StatementSolutionsPage;
