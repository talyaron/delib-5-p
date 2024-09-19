import { FC, useEffect, useRef, useState } from "react";

// Third Party
import { Screen, Statement, StatementType, User } from "delib-npm";

// Redux Store
import { useAppDispatch, useAppSelector } from "@/controllers/hooks/reduxHooks";
import {
	setStatementElementHight,
	statementSubscriptionSelector,
} from "@/model/statements/statementsSlice";

// Helpers
import { isAuthorized, linkToChildren } from "@/controllers/general/helpers";

// Hooks
import useStatementColor, {
	StyleProps,
} from "@/controllers/hooks/useStatementColor";

// Custom Components

import { setStatementIsOption } from "@/controllers/db/statements/setStatements";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import EditTitle from "@/view/components/edit/EditTitle";

import IconButton from "@/view/components/iconButton/IconButton";
import StatementChatMore from "../../../../chat/components/StatementChatMore";
import AddQuestionIcon from "@/assets/icons/addQuestion.svg?react";
import CreateStatementModal from "../../../../createStatementModal/CreateStatementModal";
import Evaluation from "../../evaluation/Evaluation";
import "./SuggestionCard.scss";
import SolutionMenu from "../../solutionMenu/SolutionMenu";
import { sortSubStatements } from "../../../statementSolutionsCont";
import { useParams } from "react-router-dom";

interface Props {
  statement: Statement;
  siblingStatements: Statement[];
  parentStatement: Statement;
  showImage: (talker: User | null) => void;
}

const SuggestionCard: FC<Props> = ({
	parentStatement,
	siblingStatements,
	statement,
}) => {
	// Hooks

	const { t, dir } = useLanguage();
	const { sort } = useParams();

	// Redux Store
	const dispatch = useAppDispatch();
	const statementColor: StyleProps = useStatementColor(
		statement.statementType || StatementType.statement
	);
	const statementSubscription = useAppSelector(
		statementSubscriptionSelector(statement.statementId)
	);

	// Use Refs
	const elementRef = useRef<HTMLDivElement>(null);

	// Use States

	const [isEdit, setIsEdit] = useState(false);
	const [shouldShowAddSubQuestionModal, setShouldShowAddSubQuestionModal] =
    useState(false);
	const [isCardMenuOpen, setIsCardMenuOpen] = useState(false);

	const _isAuthorized = isAuthorized(
		statement,
		statementSubscription,
		parentStatement.creatorId
	);

	useEffect(() => {
		const element = elementRef.current;
		if (element) {
			setTimeout(() => {
				dispatch(
					setStatementElementHight({
						statementId: statement.statementId,
						height: elementRef.current?.clientHeight,
					})
				);
			}, 0);
		}
	}, [elementRef.current?.clientHeight]);

	useEffect(() => {
		if (sort !== Screen.OPTIONS_RANDOM && sort !== Screen.QUESTIONS_RANDOM) {
			sortSubStatements(siblingStatements, sort, 30);
		}
	}, [statement.consensus]);

	useEffect(() => {
		sortSubStatements(siblingStatements, sort, 30);
	}, [statement.elementHight]);

	function handleSetOption() {
		try {
			if (statement.statementType === "option") {
				const cancelOption = window.confirm(
					"Are you sure you want to cancel this option?"
				);
				if (cancelOption) {
					setStatementIsOption(statement);
				}
			} else {
				setStatementIsOption(statement);
			}
		} catch (error) {
			console.error(error);
		}
	}

	const shouldLinkToChildStatements = linkToChildren(
		statement,
		parentStatement
	);

	const statementAge = new Date().getTime() - statement.createdAt;

	return (
		<div
			className={
				statementAge < 10000
					? "statement-evaluation-card statement-evaluation-card--new"
					: "statement-evaluation-card"
			}
			style={{
				top: `${statement.top || 0}px`,
				borderLeft: `8px solid ${statementColor.backgroundColor || "wheat"}`,
				color: statementColor.color,
				flexDirection: dir === "ltr" ? "row" : "row-reverse",
			}}
			ref={elementRef}
			id={statement.statementId}
		>
			<div
				className="selected-option"
				style={{
					backgroundColor: statement.selected
						? statementColor.backgroundColor
						: "",
				}}
			>
				<div
					style={{
						color: statementColor.color,
						display: statement.selected ? "block" : "none",
					}}
				>
					{t("Selected")}
				</div>
			</div>
			<div className="main">
				<div className="info">
					<div className="text">
						<EditTitle
							statement={statement}
							isEdit={isEdit}
							setEdit={setIsEdit}
							isTextArea={true}
						/>
					</div>
					<div className="more">
						<SolutionMenu
							statement={statement}
							isAuthorized={_isAuthorized}
							isCardMenuOpen={isCardMenuOpen}
							setIsCardMenuOpen={setIsCardMenuOpen}
							isEdit={isEdit}
							setIsEdit={setIsEdit}
							handleSetOption={handleSetOption}
						/>
					</div>
				</div>
				{shouldLinkToChildStatements && (
					<div className="chat">
						<StatementChatMore statement={statement} />
					</div>
				)}
				<div className="actions">
					<Evaluation parentStatement={parentStatement} statement={statement} />
					{parentStatement.hasChildren && (
						<IconButton
							className="add-sub-question-button"
							onClick={() => setShouldShowAddSubQuestionModal(true)}
						>
							<AddQuestionIcon />
						</IconButton>
					)}
				</div>
				{shouldShowAddSubQuestionModal && (
					<CreateStatementModal
						allowedTypes={[StatementType.question]}
						parentStatement={statement}
						isOption={false}
						setShowModal={setShouldShowAddSubQuestionModal}
					/>
				)}
			</div>
		</div>
	);
};

export default SuggestionCard;
