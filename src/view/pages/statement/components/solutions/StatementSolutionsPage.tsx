import { FC, useEffect, useState } from "react";

// Third party imports
import {
  QuestionStage,
  QuestionType,
  Statement,
  StatementType,
  User,
  isOptionFn,
} from "delib-npm";
import { useParams } from "react-router";

// Utils & Helpers
import { sortSubStatements } from "./statementSolutionsCont";

// Custom Components
import StatementEvaluationCard from "./components/StatementEvaluationCard";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";
import StatementBottomNav from "../nav/bottom/StatementBottomNav";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../controllers/hooks/reduxHooks";
import {
  questionsSelector,
  setTempStatementsForPresentation,
  statementOptionsSelector,
} from "../../../../../model/statements/statementsSlice";

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
    console.log("questions", questions);

    const isMultiStage =
      statement.questionSettings?.questionType === QuestionType.multipleSteps;

    const _subStatements = isMultiStage
      ? useAppSelector(statementOptionsSelector(statement.statementId)).filter(
          (statement: Statement) => statement.isPartOfTempPresentation
        )
      : questions
        ? questionsSelector(statement.statementId)
        : subStatements;

    const dispatch = useAppDispatch();

    const [showModal, setShowModal] = useState(false);

    console.log("isMultiStage", isMultiStage);

    useEffect(() => {
      (async () => {
        console.log("useEffect statement.questionSettings?.questionType");
        if (isMultiStage) {
          getMultiStageOptions(statement, dispatch);
          console.log("get by rest api multiStageOptions");
        }
        // setSortedSubStatements(sortSubStatements(__subStatements, sort));
      })();
    }, [statement.questionSettings?.questionType]);

    // Variables
    let topSum = 30;
    const tops: number[] = [topSum];
    console.log("tops", tops);
    // console.log("run.........", sortedSubStatements.length);
    console.log("sort", sort);

    return (
      <>
        <div className="page__main">
          <div className="wrapper">
            {_subStatements?.map((statementSub: Statement, i: number) => {
              //get the top of the element
              if (statementSub.elementHight) {
                console.log("add topSum", topSum);
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

async function getMultiStageOptions(
  statement: Statement,
  dispatch: any
): Promise<void> {
  try {
    if (statement.questionSettings?.currentStage === QuestionStage.suggestion) {
      const response = await fetch(
        `http://localhost:5001/synthesistalyaron/us-central1/getRandomStatements?parentId=${statement.statementId}&limit=2`
      );
      const { randomStatements, error } = await response.json();
      if (error) throw new Error(error);

      dispatch(setTempStatementsForPresentation(randomStatements));
    } else if (
      statement.questionSettings?.currentStage === QuestionStage.firstEvaluation
    ) {
      const response = await fetch(
        `http://localhost:5001/synthesistalyaron/us-central1/getRandomStatements?parentId=${statement.statementId}&limit=2`
      );
      const { randomStatements, error } = await response.json();
      if (error) throw new Error(error);
      dispatch(setTempStatementsForPresentation(randomStatements));
    } else if (
      statement.questionSettings?.currentStage ===
      QuestionStage.secondEvaluation
    ) {
      const response = await fetch(
        `http://localhost:5001/synthesistalyaron/us-central1/getTopStatements?parentId=${statement.statementId}&limit=2`
      );
      const { topSolutions, error } = await response.json();
      if (error) throw new Error(error);
      dispatch(setTempStatementsForPresentation(topSolutions));
    } else {
      dispatch(setTempStatementsForPresentation([]));
    }
  } catch (error) {
    console.error(error);
    dispatch(setTempStatementsForPresentation([]));
  }
}
