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
import { useParams, useNavigate } from "react-router";

// Utils & Helpers
import { sortSubStatements } from "./statementSolutionsCont";

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
import { getMultiStageOptions } from "@/controllers/db/multiStageQuestion/getMultiStageStatements";
import styles from "./statementSolutinsPage.module.scss";
import ideaImage from "@/assets/images/manWithIdeaLamp.png";
import WhitePlusIcon from "@/view/components/icons/WhitePlusIcon";
import useWindowDimensions from "@/controllers/hooks/useWindowDimentions";
import { useMultiStage } from "./statementSolutionsHooks";
import { set } from "node_modules/cypress/types/lodash";

interface StatementEvaluationPageProps {
  statement: Statement;
  subStatements: Statement[];
  handleShowTalker: (talker: User | null) => void;
  showNav?: boolean;
  questions?: boolean;
  toggleAskNotifications: () => void;
  currentPage?: string;
}

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
    const isMuliStage =
      statement.questionSettings?.questionType === QuestionType.multipleSteps;
    const currentStage = statement.questionSettings?.currentStage;
    const stageInfo = getStagesInfo(currentStage);
    const useSearchForSimilarStatements =
      statement.statementSettings?.enableSimilaritiesSearch || false;

    //hooks
    const { subStatements: multiStageOptions, isLoading } = useMultiStage({
      statement,
    });

    // Use States
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showExplanation, setShowExplanation] = useState(
      currentStage === QuestionStage.explanation && isMuliStage && !questions
    );
    const [sortedSubStatements, setSortedSubStatements] = useState<Statement[]>(
      [...subStatements]
    );

    useEffect(() => {
      if (isMuliStage) {
        setSortedSubStatements(multiStageOptions);
      } else {
        const _sortedSubStatements = sortSubStatements(
          subStatements,
          sort
        ).filter((subStatement) => {
          //if questions is true, only show questions
          if (questions) {
            return subStatement.statementType === StatementType.question;
          }

          if (isMuliStage) {
            //filter the temp presentation designed for this stage
            return subStatement.isPartOfTempPresentation;
          }

          //if options is true, only show options
          return isOptionFn(subStatement);
        });

        setSortedSubStatements(_sortedSubStatements);
      }
    }, [sort, subStatements, questions, isMuliStage, multiStageOptions]);

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
        isMuliStage &&
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

    const handlePlusIconClick = () => {
      setShowModal(true);
    };

    const { width } = useWindowDimensions();
    const smallScreen = width < 1024;

    const renderCommonContent = () => (
      <>
        <div
          className={styles.addingStatementWrapper}
          style={{ paddingTop: "2rem" }}
        >
          <div className={styles.header}>
            <div className={styles.title}>
              <h1 className={styles.h1}>
                {isLoading && <p>Loading...</p>}
                {smallScreen ? (
                  <>
                    {t(`Click on`)}{" "}
                    <span className={styles.titleSpan}>{t(`”+”`)}</span>{" "}
                    {t(`to add your ${currentPage}`)}
                  </>
                ) : (
                  <>
                    <h1>
                      {`Click on `}
                      <span className={styles.titleSpan}>
                        {`” ${t(`Add ${currentPage} button`)} ”`}
                      </span>
                      <br />
                      {` to add your ${t(`${currentPage}`)}`}
                    </h1>
                  </>
                )}
              </h1>
            </div>
            <div
              className={styles.plusButton}
              onClick={handlePlusIconClick}
              style={smallScreen ? { width: "4rem", height: "4rem" } : {}}
            >
              {smallScreen ? (
                <WhitePlusIcon />
              ) : (
                <p>
                  {" "}
                  {t(`Add ${currentPage}`)} <WhitePlusIcon />{" "}
                </p>
              )}
            </div>
          </div>
          <img src={ideaImage} alt="" className={styles.ideaImage} />
        </div>
        {isMuliStage && stageInfo?.message && (
          <Toast
            text={`${t(stageInfo.message)}${currentStage === QuestionStage.suggestion ? `: "${getTitle(statement)}"` : ""}`}
            type="message"
            show={showToast}
            setShow={setShowToast}
          >
            {getToastButtons(currentStage)}
          </Toast>
        )}
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
            isMuliStage={isMuliStage}
            setShowModal={setShowModal}
            useSimilarStatements={useSearchForSimilarStatements}
          />
        )}
      </>
    );

    if (sortedSubStatements.length === 0) {
      return renderCommonContent();
    }

    return (
      <>
        <div className="page__main">
          <div className={`wrapper ${styles.wrapper}`}>
            {isMuliStage && message && (
              <Toast
                text={`${t(message)}${currentStage === QuestionStage.suggestion ? `: "${getTitle(statement)}` : ""}`}
                type="message"
                show={showToast}
                setShow={setShowToast}
              >
                {getToastButtons(currentStage)}
              </Toast>
            )}
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
            isMuliStage={isMuliStage}
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
