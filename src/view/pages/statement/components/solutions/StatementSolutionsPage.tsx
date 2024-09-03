import { FC, useEffect, useState } from "react";

// Third party imports
import { QuestionStage, QuestionType, Statement, User } from "delib-npm";
import { useParams, useNavigate } from "react-router";

// Utils & Helpers
import { getSubStatements } from "./statementSolutionsCont";

// Custom Components
import StatementEvaluationCard from "./components/StatementSolutionCard";
import StatementBottomNav from "../nav/bottom/StatementBottomNav";
import Toast from "@/view/components/toast/Toast";
import Modal from "@/view/components/modal/Modal";
import StatementInfo from "../vote/components/info/StatementInfo";
import Button from "@/view/components/buttons/button/Button";
import LightBulbIcon from "@/assets/icons/lightBulbIcon.svg?react";
import X from "@/assets/icons/x.svg?react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { getStagesInfo } from "../settings/components/QuestionSettings/QuestionStageRadioBtn/QuestionStageRadioBtn";
import { getTitle } from "@/controllers/general/helpers";
import CreateStatementModalSwitch from "../createStatementModalSwitch/CreateStatementModalSwitch";
import styles from "./statementSolutinsPage.module.scss";

import { useSelector } from "react-redux";
import { myStatementsByStatementIdSelector } from "@/model/statements/statementsSlice";
import EmptyScreen from "./components/emptyScreen/EmptyScreen";

interface StatementEvaluationPageProps {
  statement: Statement;
  subStatements: Statement[];
  handleShowTalker: (talker: User | null) => void;
  showNav?: boolean;
  questions?: boolean;
  toggleAskNotifications: () => void;
  currentPage?: string;
}
let counter = 0;
const StatementEvaluationPage: FC<StatementEvaluationPageProps> = ({
  statement,
  subStatements,
  handleShowTalker,
  questions = false,
  toggleAskNotifications,
  currentPage = `suggestion`,
}) => {
  try {
    // Hooks
    const { sort } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const isMultiStage =
      statement.questionSettings?.questionType === QuestionType.multipleSteps;

    const myStatements = useSelector(
      myStatementsByStatementIdSelector(statement.statementId)
    );

    const currentStage = statement.questionSettings?.currentStage;
    const stageInfo = getStagesInfo(currentStage);
    const useSearchForSimilarStatements =
      statement.statementSettings?.enableSimilaritiesSearch || false;

    // Use States
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showExplanation, setShowExplanation] = useState(
      currentStage === QuestionStage.explanation && isMultiStage && !questions
    );
    const [sortedSubStatements, setSortedSubStatements] = useState<Statement[]>(
      [...subStatements]
    );

    useEffect(() => {
      getSubStatements({
        statement,
        subStatements,
        sort,
        questions,
        myStatements,
        setSortedSubStatements,
      });
    }, [sort, subStatements, questions, isMultiStage]);

    useEffect(() => {
      if (questions) {
        setShowToast(false);
      }
    }, [questions]);

    useEffect(() => {
      if (!showToast && !questions) {
        setShowToast(true);
      }
      if (
        currentStage === QuestionStage.explanation &&
        isMultiStage &&
        !questions
      ) {
        setShowExplanation(true);
      }
      if (currentStage === QuestionStage.voting && !questions) {
        //redirect us react router dom to voting page
        navigate(`/statement/${statement.statementId}/vote`);
      }
    }, [statement.questionSettings?.currentStage, questions]);

    // Variables
    let topSum = 30;
    const tops: number[] = [topSum];
    const message = stageInfo ? stageInfo.message : false;

    if (sortedSubStatements.length === 0) {
      return;
    }

    return (
      <>
        <div className="page__main">
          {sortedSubStatements.length === 0 ? (
            <EmptyScreen
              currentPage={currentPage}
              setShowModal={setShowModal}
            />
          ) : (
            <div className={`wrapper ${styles.wrapper}`}>
              {isMultiStage && message && (
                <Toast
                  text={`${t(message)}${currentStage === QuestionStage.suggestion ? `: "${getTitle(statement)}` : ""}`}
                  type="message"
                  show={showToast}
                  setShow={setShowToast}
                >
                  {getToastButtons(currentStage)}
                </Toast>
              )}
              {sortedSubStatements?.map(
                (statementSub: Statement, i: number) => {
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
                }
              )}
              <div
                className="options__bottom"
                style={{ height: `${topSum + 70}px` }}
              ></div>
            </div>
          )}
        </div>
        <div className="page__footer">
          <StatementBottomNav
            setShowModal={setShowModal}
            statement={statement}
          />
        </div>
        {showExplanation && (
          <Modal>
            <StatementInfo
              statement={statement}
              setShowInfo={setShowExplanation}
            />
          </Modal>
        )}
        {showModal && (
          <CreateStatementModalSwitch
            toggleAskNotifications={toggleAskNotifications}
            parentStatement={statement}
            isQuestion={questions}
            isMultiStage={isMultiStage}
            setShowModal={setShowModal}
            useSimilarStatements={useSearchForSimilarStatements}
          />
        )}
      </>
    );

    function getToastButtons(questionStage: QuestionStage | undefined) {
      try {
        switch (questionStage) {
          case QuestionStage.voting:
          case QuestionStage.firstEvaluation:
          case QuestionStage.secondEvaluation:
          case QuestionStage.finished:
          case QuestionStage.explanation:
            return (
              <Button
                text={t("Close")}
                iconOnRight={false}
                onClick={() => {
                  setShowToast(false);
                }}
                icon={<X />}
                color="white"
                bckColor="var(--crimson)"
              />
            );
          case QuestionStage.suggestion:
            return (
              <>
                <Button
                  text={t("Close")}
                  iconOnRight={false}
                  onClick={() => {
                    setShowToast(false);
                  }}
                  icon={<X />}
                  color="white"
                  bckColor="var(--crimson)"
                />
                <Button
                  text={t("Add a solution")}
                  iconOnRight={true}
                  onClick={() => {
                    setShowToast(false);
                    setShowModal(true);
                  }}
                  icon={<LightBulbIcon />}
                  color="white"
                  bckColor="var(--green)"
                />
              </>
            );
          default:
            return (
              <Button
                text={t("Close")}
                iconOnRight={false}
                onClick={() => {
                  setShowToast(false);
                }}
                icon={<X />}
                color="white"
                bckColor="var(--crimson)"
              />
            );
        }
      } catch (error) {
        console.error(error);

        return null;
      }
    }
  } catch (error) {
    console.error(error);

    return null;
  }
};

export default StatementEvaluationPage;
