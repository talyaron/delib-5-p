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
import Toast from "../../../../components/toast/Toast";
import Modal from "../../../../components/modal/Modal";
import StatementInfo from "../vote/components/info/StatementInfo";
import Button from "../../../../components/buttons/button/Button";
import LightBulbIcon from "../../../../../assets/icons/lightBulbIcon.svg?react";
import X from "../../../../../assets/icons/x.svg?react";
import { useLanguage } from "../../../../../controllers/hooks/useLanguages";
import { getStagesInfo } from "../settings/components/QuestionSettings/QuestionStageRadioBtn/QuestionStageRadioBtn";
import { getTitle } from "../../../../../controllers/general/helpers";
import CreateStatementModalSwitch from "../createStatementModalSwitch/CreateStatementModalSwitch";
import { getMultiStageOptions } from "../../../../../controllers/db/multiStageQuestion/getMultiStageStatements";
import styles from "./statementSolutinsPage.module.scss";
import ideaImage from "../../../../../assets/images/manWithIdeaLamp.png";
import WhitePlusIcon from "../../../../components/icons/WhitePlusIcon";
import useWindowDimensions from "../../../../../controllers/hooks/useWindowDimentions";

interface StatementEvaluationPageProps {
  statement: Statement;
  subStatements: Statement[];
  handleShowTalker: (talker: User | null) => void;
  currentPage?: string;
  showNav?: boolean;
  questions?: boolean;
  toggleAskNotifications: () => void;
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

		// Use States
		const [showModal, setShowModal] = useState(false);
		const [showToast, setShowToast] = useState(false);
		const [showExplanation, setShowExplanation] = useState(
			currentStage === QuestionStage.explanation && isMuliStage && !questions
		);
		const [sortedSubStatements, setSortedSubStatements] = useState<Statement[]>(
			[...subStatements]
		);
		const [isNavigationOpen, setIsNavigationOpen] = useState(false);

		useEffect(() => {
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
		}, [sort, subStatements, questions]);

		useEffect(() => {
			if (questions) {
				setShowToast(false);
			}
		}, [questions]);

		useEffect(() => {
			if (isMuliStage) {
				getMultiStageOptions(statement);
			}
		}, [currentStage]);

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
		const topSum = 30;
		const tops: number[] = [topSum];
		const message = stageInfo ? stageInfo.message : false;

		const handlePlusIconClick = () => {
			setShowModal(true);
		};

		const { width } = useWindowDimensions();
		const smallScreen = width < 1024;

		//empty screen with small screen
		if (sortedSubStatements.length === 0) {
			if (smallScreen) {
				return (
					<>
						<div
							className={styles.addingStatementWrapper}
							style={{ paddingTop: "2rem" }}
						>
							<div className={styles.header}>
								<div className={styles.title}>
									<h1 className={styles.h1}>
										{t(`Click on`)}{" "}
										<span className={styles.titleSpan}>
											{t(`”+”`)}
										</span>{" "}
										{t(`to add your suggestion`)}
									</h1>
								</div>
								<div
									className={styles.plusButton}
									onClick={handlePlusIconClick}
									style={{ width: "4rem", height: "4rem" }}
								>
									<WhitePlusIcon />
								</div>
							</div>
							<img src={ideaImage} alt="" className={styles.ideaImage} />
						</div>
						{isMuliStage && message && (
							<Toast
								text={`${t(message)}${currentStage === QuestionStage.suggestion ? `: "${getTitle(statement)}"` : ""}`}
								type="message"
								show={showToast}
								setShow={setShowToast}
							>
								{getToastButtons(currentStage)}
							</Toast>
						)}
						{sortedSubStatements?.map((statementSub: Statement, i: number) => {
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
			} else {
				//empty screen with large screen
				return (
					<>
						<div
							className={styles.addingStatementWrapper}
							style={{ paddingTop: "2rem" }}
						>
							<div className={styles.header}>
								<div className={styles.title}>
									<h1>
										<span className={styles.titleSpan}>
											{t(`” Add ${currentPage} button ”`)}
										</span>{" "}
									</h1>
								</div>
								<div
									className={styles.plusButton}
									onClick={handlePlusIconClick}
								>
									<p>{t(`Add ${currentPage}`)}</p>
									<WhitePlusIcon />
								</div>
							</div>
							<img src={ideaImage} alt="" className={styles.ideaImage} />
						</div>
						{isMuliStage && message && (
							<Toast
								text={`${t(message)}${currentStage === QuestionStage.suggestion ? `: "${getTitle(statement)}"` : ""}`}
								type="message"
								show={showToast}
								setShow={setShowToast}
							>
								{getToastButtons(currentStage)}
							</Toast>
						)}
						{sortedSubStatements?.map((statementSub: Statement, i: number) => {
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
			}
		}

		return (
			<>
				{smallScreen ? (

				//1 + in screen with small screen
					<div className={styles.wrapper}>
						<div className={styles.main}>
							{isMuliStage && message && (
								<Toast
									text={`${t(message)}${
										currentStage === QuestionStage.suggestion
											? `: "${getTitle(statement)}"`
											: ""
									}`}
									type="message"
									show={showToast}
									setShow={setShowToast}
								>
									{getToastButtons(currentStage)}
								</Toast>
							)}
							{sortedSubStatements?.map(
								(statementSub: Statement, i: number) => {
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
						</div>
						<div
							className={styles.addingStatementWrapper}
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "baseline",
								paddingInline: "2.5rem",
								position: "absolute",
								width: "100%",
							}}
						>
							<div
								className={styles.plusButton}
								onClick={handlePlusIconClick}
								style={{ visibility: isNavigationOpen ? "hidden" : "visible" }}
							>
								<WhitePlusIcon />
							</div>
							{sortedSubStatements.length > 1 && (
								<div className={styles.bottomNav}>
									<StatementBottomNav
										setShowModal={setShowModal}
										statement={statement}
										setIsNavigationOpen={setIsNavigationOpen}
										isNavigationOpen={isNavigationOpen}
										currentPage={currentPage}
									/>
								</div>
							)}
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
					</div>
				) : (

				//1 + in screen with large screen
					<div className={styles.wrapper}>
						<div
							className={styles.main}
							style={
								sortedSubStatements.length >= 2 ? { marginTop: "5rem" } : {}
							}
						>
							<div
								className={
									sortedSubStatements.length < 2
										? styles.addingStatementWrapper
										: `${styles.addingStatementWrapper} ${styles.sortSuggestionActive}`
								}
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "baseline",
								}}
							>
								<div
									className={styles.plusButton}
									onClick={handlePlusIconClick}
								>
									<WhitePlusIcon />
									<p>{t(`Add ${currentPage}`)}</p>
								</div>
								{sortedSubStatements.length > 1 && (
									<div className={styles.bottomNav}>
										<StatementBottomNav
											setShowModal={setShowModal}
											statement={statement}
											setIsNavigationOpen={setIsNavigationOpen}
											isNavigationOpen={isNavigationOpen}
											currentPage={currentPage}
										/>
									</div>
								)}
							</div>
							{isMuliStage && message && (
								<Toast
									text={`${t(message)}${
										currentStage === QuestionStage.suggestion
											? `: "${getTitle(statement)}"`
											: ""
									}`}
									type="message"
									show={showToast}
									setShow={setShowToast}
								>
									{getToastButtons(currentStage)}
								</Toast>
							)}
							{sortedSubStatements?.map(
								(statementSub: Statement, i: number) => {
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
					</div>
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
