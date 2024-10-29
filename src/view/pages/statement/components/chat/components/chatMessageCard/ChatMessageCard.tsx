import { ChangeEvent, FC, useEffect, useState } from 'react';

// Third Party Imports
import { Statement, User } from 'delib-npm';

// Redux Store
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import { statementSubscriptionSelector } from '@/model/statements/statementsSlice';
import { store } from '@/model/store';

// Helper functions
import { isAuthorized } from '@/controllers/general/helpers';

// Hooks
import useStatementColor from '@/controllers/hooks/useStatementColor';

// Custom Components
import EditTitle from '@/view/components/edit/EditTitle';
import StatementChatMore from '../StatementChatMore';
import UserAvatar from '../userAvatar/UserAvatar';
import AddQuestionIcon from '@/assets/icons/addQuestion.svg?react';
import EditIcon from '@/assets/icons/editIcon.svg?react';
import LightBulbIcon from '@/assets/icons/lightBulbIcon.svg?react';
import QuestionMarkIcon from '@/assets/icons/questionIcon.svg?react';
import DeleteIcon from '@/assets/icons/delete.svg?react';
import SaveTextIcon from '@/assets/icons/SaveTextIcon.svg';
import {
	setStatementIsOption,
	updateIsQuestion,
	updateStatementText,
} from '@/controllers/db/statements/setStatements';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import Menu from '@/view/components/menu/Menu';
import MenuOption from '@/view/components/menu/MenuOption';
import CreateStatementModal from '@/view/pages/statement/components/createStatementModal/CreateStatementModal';

import './ChatMessageCard.scss';
import { deleteStatementFromDB } from '@/controllers/db/statements/deleteStatements';
import Evaluation from '../../../evaluations/components/evaluation/Evaluation';
import { DeliberativeElement } from 'delib-npm/dist/models/statementsModels';
import useAutoFocus from '@/controllers/hooks/useAutoFocus ';

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
	const { deliberativeElement, isResult } = statement;
	const statementColor = useStatementColor({ deliberativeElement, isResult });
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
	const [text, setText] = useState(
		`${statement?.statement}\n${statement.description}`
	);

	// Variables
	const creatorId = statement.creatorId;
	const _isAuthorized = isAuthorized(
		statement,
		statementSubscription,
		parentStatement.creatorId
	);
	const isMe = userId === creatorId;
	const isQuestion = deliberativeElement === DeliberativeElement.research;
	const isOption = deliberativeElement === DeliberativeElement.option;
	const isStatement = deliberativeElement === DeliberativeElement.general;
	const textareaRef = useAutoFocus(isEdit);

	const isPreviousFromSameAuthor = previousStatement?.creatorId === creatorId;

	const isAlignedLeft = (isMe && dir === 'ltr') || (!isMe && dir === 'rtl');

	const shouldLinkToChildren = parentStatement.hasChildren;

	// Focus the textarea when in edit mode
	useEffect(() => {
		if (isEdit && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [isEdit]);

	useEffect(() => {
		if (isCardMenuOpen) {
			setTimeout(() => {
				setIsCardMenuOpen(false);
			}, 5000);
		}
	}, [isCardMenuOpen]);

	function handleSetOption() {
		try {
			if (statement.deliberativeElement === DeliberativeElement.option) {
				const cancelOption = window.confirm(
					'Are you sure you want to cancel this option?'
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
			if (!statement) throw new Error('Statement is undefined');
			const title = text.split('\n')[0];
			const description = text.split('\n').slice(1).join('\n');

			updateStatementText(statement, title, description);
			setIsEdit(false);
		} catch (error) {
			console.error(error);
		}
	}

	const isGeneral =
		statement.deliberativeElement === DeliberativeElement.general ||
		statement.deliberativeElement === undefined;

	return (
		<div
			className={`chat-message-card ${isAlignedLeft && 'aligned-left'} ${dir}`}
		>
			{!isPreviousFromSameAuthor && (
				<div className='user'>
					<UserAvatar user={statement.creator} showImage={showImage} />
					<span>{statement.creator.displayName}</span>
				</div>
			)}

			<div
				className={
					isStatement ? 'message-box message-box--statement' : 'message-box'
				}
				style={{
					borderColor: isGeneral
						? 'var(--inputBackground)'
						: statementColor.backgroundColor,
				}}
			>
				{!isPreviousFromSameAuthor && <div className='triangle' />}

				<div className='info'>
					<div className='info-text'>
						{isEdit ? (
							<div
								className='input-wrapper'
								style={{
									flexDirection: isAlignedLeft ? 'row' : 'row-reverse',
								}}
							>
								<textarea
									ref={textareaRef} // Ref for managing focus
									className='edit-input'
									value={text}
									onChange={handleTextChange}
									style={{ direction: dir }}
								/>
								<button onClick={handleSave}>
									<img
										src={SaveTextIcon}
										className='save-icon'
										alt='Save Icon'
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
						iconColor='var(--icon-blue)'
					>
						{_isAuthorized && (
							<MenuOption
								label={t('Edit Text')}
								icon={<EditIcon />}
								onOptionClick={() => {
									setIsEdit(!isEdit);
									setIsCardMenuOpen(false);
								}}
							/>
						)}
						{_isAuthorized && (
							<MenuOption
								isOptionSelected={isOption}
								icon={<LightBulbIcon />}
								label={
									isOption ? t('Unmark as a Solution') : t('Mark as a Solution')
								}
								onOptionClick={() => {
									handleSetOption();
									setIsCardMenuOpen(false);
								}}
							/>
						)}

						{!isOption && (
							<MenuOption
								isOptionSelected={isQuestion}
								label={
									isQuestion
										? t('Unmark as a Question')
										: t('Mark as a Question')
								}
								icon={<QuestionMarkIcon />}
								onOptionClick={() => {
									updateIsQuestion(statement);
									setIsCardMenuOpen(false);
								}}
							/>
						)}
						{_isAuthorized && (
							<MenuOption
								label={t('Delete')}
								icon={<DeleteIcon />}
								onOptionClick={() => {
									deleteStatementFromDB(statement, _isAuthorized);
									setIsCardMenuOpen(false);
								}}
							/>
						)}
					</Menu>
				</div>
				<div className='bottom-icons'>
					<StatementChatMore statement={statement} />
					<Evaluation parentStatement={parentStatement} statement={statement} />
					{shouldLinkToChildren && (
						<button
							className='add-question-btn'
							aria-label='Add question button'
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
