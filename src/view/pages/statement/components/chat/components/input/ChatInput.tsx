import { Statement } from 'delib-npm';
import { FC, useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.scss';
// Third Party Imports

// Icons
import { handleAddStatement } from './StatementInputCont';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';

// Redux Store
import useDirection from '@/controllers/hooks/useDirection';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import useStatementColor from '@/controllers/hooks/useStatementColor';
import { userSelector } from '@/model/users/userSlice';
import SendIcon from '@/view/components/icons/SendIcon';

interface Props {
	statement: Statement;
}

const ChatInput: FC<Props> = ({ statement }) => {
	if (!statement) throw new Error('No statement');

	// Redux hooks
	const { t } = useLanguage();
	const user = useAppSelector(userSelector);

	const statementColor = useStatementColor({ statement });

	const direction = useDirection();
	const [message, setMessage] = useState('');

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, []);

	const adjustTextareaHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	function handleKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		try {
			const _isMobile =
				!!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				);

			if (e.key === 'Enter' && !e.shiftKey && !_isMobile) {
				handleSubmitInput(e);
			}
		} catch (error) {
			console.error(error);
		}
	}

	const handleSubmitInput = (
		e:
			| React.FormEvent<HTMLFormElement>
			| React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		e.preventDefault();

		// Create statement
		handleAddStatement(message, statement, user);

		setMessage('');
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
		}
	};

	return (
		<div className={styles.chatInput}>
			<form
				onSubmit={(e) => handleSubmitInput(e)}
				name='theForm'

				style={{ flexDirection: direction }}
			>
				<textarea
					style={{
						borderTop: `2px solid ${statementColor.backgroundColor}`,
						minHeight: '40px', // Add minimum height
						resize: 'none',    // Prevent manual resizing since we're handling it
						overflow: 'hidden' // Hide scrollbar since we're auto-expanding
					}}
					data-cy='statement-chat-input'
					className='page__footer__form__input'
					aria-label='Form Input'
					name='newStatement'
					ref={textareaRef}
					onKeyUp={(e) => handleKeyUp(e)}
					value={message}
					onInput={adjustTextareaHeight}
					onChange={(e) => {
						setMessage(e.target.value)
						adjustTextareaHeight(); // Call height adjustment on change

					}}
					required
					placeholder={t('Type your message here...')}
				></textarea>
				<button
					type='submit'
					aria-label='Submit Button'
					style={statementColor}
					data-cy='statement-chat-send-btn'
				>
					<SendIcon color={statementColor.color} />
				</button>
			</form>
		</div>
	);
};

export default ChatInput;
