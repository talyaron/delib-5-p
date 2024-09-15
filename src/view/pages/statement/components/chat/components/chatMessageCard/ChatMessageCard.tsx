import { ChangeEvent, FC, useEffect, useState } from "react";

// Third Party Imports
import { Statement, StatementType, User, isOptionFn } from "delib-npm";

// Redux Store
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { statementSubscriptionSelector } from "@/model/statements/statementsSlice";
import { store } from "@/model/store";

// Helper functions
import { isAuthorized, linkToChildren } from "@/controllers/general/helpers";

// Hooks
import useStatementColor from "@/controllers/hooks/useStatementColor";

// Custom Components
import EditTitle from "@/view/components/edit/EditTitle"; // Import EditTitle component
import StatementChatMore from "../StatementChatMore";
import UserAvatar from "../userAvatar/UserAvatar";

// import Evaluation from "../../../../../components/evaluation/simpleEvaluation/SimplEvaluation";
import AddQuestionIcon from "@/assets/icons/addQuestion.svg?react";
import EditIcon from "@/assets/icons/editIcon.svg?react";
import LightBulbIcon from "@/assets/icons/lightBulbIcon.svg?react";
import QuestionMarkIcon from "@/assets/icons/questionIcon.svg?react";
import DeleteIcon from "@/assets/icons/delete.svg?react";
import SaveTextIcon from "@/assets/icons/SaveTextIcon.svg";
import {
	setStatementIsOption,
	updateIsQuestion,
	updateStatementText,
} from "@/controllers/db/statements/setStatements";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import Menu from "@/view/components/menu/Menu";
import MenuOption from "@/view/components/menu/MenuOption";
import CreateStatementModal from "@/view/pages/statement/components/createStatementModal/CreateStatementModal";

import useAutoFocus from "@/controllers/hooks/useAutoFocus ";
import "./ChatMessageCard.scss";
import { deleteStatementFromDB } from "@/controllers/db/statements/deleteStatements";

export interface NewQuestion {
  statement: Statement;
  isOption: boolean;
  showModal: boolean;
}

interface ChatMessageCardProps {
  parentStatement: Statement;
  statement: Statement;
  showImage: (statement: User | null) => void;
  index: number;
  previousStatement: Statement | undefined;
}

const ChatMessageCard: FC<ChatMessageCardProps> = ({
	parentStatement,
	statement,
	showImage,
	previousStatement,
}) => {
	// Hooks
	const { statementType } = statement;
	const statementColor = useStatementColor(statementType);
	const { t, dir } = useLanguage();

	// Redux store
	const userId = store.getState().user.user?.uid;
	const statementSubscription = useAppSelector(
		statementSubscriptionSelector(statement.parentId)
	);

	// Use States
	const [isEdit, setIsEdit] = useState(false);
	const [isNewStatementModalOpen, setIsNewStatementModalOpen] = useState(false);
	const [isCardMenuOpen, setIsCardMenuOpen] = useState(false);
	const [text, setText] = useState(`${statement?.statement}\n${statement.description}`);

	// Variables
	const creatorId = statement.creatorId;
	const _isAuthorized = isAuthorized(
		statement,
		statementSubscription,
		parentStatement.creatorId
	);

	const isMe = userId === creatorId;
	const isQuestion = statementType === StatementType.question;
	const isOption = isOptionFn(statement);
	const isStatement = statementType === StatementType.statement;
	const isParentOption = isOptionFn(parentStatement);
	const textareaRef = useAutoFocus(isEdit);

	const shouldLinkToChildStatements =
    (isQuestion || isOption) && parentStatement.hasChildren;

	const isPreviousFromSameAuthor = previousStatement?.creatorId === creatorId;

	const isAlignedLeft = (isMe && dir === "ltr") || (!isMe && dir === "rtl");

	const shouldLinkToChildren = linkToChildren(statement, parentStatement);

	useEffect(() => {
		if(isCardMenuOpen){
			setTimeout(() => {
				setIsCardMenuOpen(false);
			},5000);
		}
	}, [isCardMenuOpen]);

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

	function handleTextChange(
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) {
		setText(e.target.value);
	}

	function handleSave() {
		try {
			if (!text) return;
			if (!statement) throw new Error("Statement is undefined");
			const title = text.split("\n")[0];
			const description = text.split("\n").slice(1).join("\n")	;

			updateStatementText(statement, title, description);
			setIsEdit(false);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div
			className={`chat-message-card ${isAlignedLeft && "aligned-left"} ${dir}`}
		>
			{!isPreviousFromSameAuthor && (
				<div className="user">
					<UserAvatar user={statement.creator} showImage={showImage} />
					<span>{statement.creator.displayName}</span>
				</div>
			)}

			<div
				className={
					isStatement ? "message-box message-box--statement" : "message-box"
				}
				style={{ borderColor: statementColor.backgroundColor }}
			>
				{!isPreviousFromSameAuthor && <div className="triangle" />}

				<div className="info">
					<div className="info-text">
						{isEdit ? (
							<div
								className="input-wrapper"
								style={{ flexDirection: isAlignedLeft ? "row" : "row-reverse" }}
							>
								<textarea
									ref={textareaRef}
									className="edit-input"
									value={text}
									onChange={handleTextChange}
									autoFocus={true}
									style={{ direction: dir }}
								/>
								<button onClick={handleSave}>
									<img
										src={SaveTextIcon}
										className="save-icon"
										alt="Save Icon"
									/>
								</button>
							</div>
						) : (
							<EditTitle
								statement={statement}
								isEdit={isEdit}
								setEdit={setIsEdit}
								isTextArea={true}
							/>
						)}
					</div>

					<Menu
						setIsOpen={setIsCardMenuOpen}
						isMenuOpen={isCardMenuOpen}
						iconColor="var(--icon-blue)"
					>
						{_isAuthorized && (
							<MenuOption
								label={t("Edit Text")}
								icon={<EditIcon />}
								onOptionClick={() => {
									setIsEdit(!isEdit);
									setIsCardMenuOpen(false);
								}}
							/>
						)}
						{_isAuthorized && !isQuestion && !isParentOption && (
							<MenuOption
								isOptionSelected={isOptionFn(statement)}
								icon={<LightBulbIcon />}
								label={
									isOptionFn(statement)
										? t("Unmark as a Solution")
										: t("Mark as a Solution")
								}
								onOptionClick={()=>{
									handleSetOption()
									setIsCardMenuOpen(false);
								}}
							/>
						)}

						{!isOption && (
							<MenuOption
								isOptionSelected={isQuestion}
								label={
									isQuestion
										? t("Unmark as a Question")
										: t("Mark as a Question")
								}
								icon={<QuestionMarkIcon />}
								onOptionClick={() => {
									updateIsQuestion(statement)
									setIsCardMenuOpen(false);
								}}
							/>
						)}
						{_isAuthorized && <MenuOption
							label={t("Delete")}
							icon={<DeleteIcon />}
							onOptionClick={() => {
								deleteStatementFromDB(statement, _isAuthorized)
								setIsCardMenuOpen(false);
							}}
						/>}
					</Menu>
				</div>
				<div className="bottom-icons">
					{shouldLinkToChildStatements && (
						<StatementChatMore statement={statement} />
					)}
					{shouldLinkToChildren && (
						<button
							className="add-question-btn"
							aria-label="Add question button"
							onClick={() => setIsNewStatementModalOpen(true)}
						>
							<AddQuestionIcon />
						</button>
					)}
				</div>
				{isNewStatementModalOpen && (
					<CreateStatementModal
						parentStatement={statement}
						isOption={false}
						setShowModal={setIsNewStatementModalOpen}
					/>
				)}
			</div>
		</div>
	);
};

export default ChatMessageCard;
