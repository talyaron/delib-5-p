import { Dispatch, FC } from "react";
import styles from "../../StatementSolutionsPage.module.scss";
import useWindowDimensions from "@/controllers/hooks/useWindowDimentions";

// /graphics
import ideaImage from "@/assets/images/manWithIdeaLamp.png";
import WhitePlusIcon from "@/view/components/icons/WhitePlusIcon";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { StageInfo } from "../../../settings/components/QuestionSettings/QuestionStageRadioBtn/QuestionStageRadioBtn";

interface Props {
  currentPage: string;
  stageInfo: StageInfo | undefined;
  setShowModal: Dispatch<boolean>;
}

const EmptyScreen: FC<Props> = ({ currentPage, stageInfo,setShowModal }) => {
    const {t} = useLanguage();
  const { width } = useWindowDimensions();
  const smallScreen = width < 1024;

  const handlePlusIconClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className={styles.addingStatementWrapper}
        style={{ paddingTop: "2rem" }}
      >
        <div className={styles.header}>
          <div className={styles.title}>
            <h1 className={styles.h1}>
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
      {isMultiStage && stageInfo?.message && (
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
          isMultiStage={isMultiStage}
          setShowModal={setShowModal}
          useSimilarStatements={useSearchForSimilarStatements}
        />
      )}
    </>
  );
};

export default EmptyScreen;
