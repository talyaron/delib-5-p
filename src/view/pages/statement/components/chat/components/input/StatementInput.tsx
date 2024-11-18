import { FC, useState, useEffect, useRef } from 'react';
import styles from './statementInput.module.scss';
// Third Party Imports
import { Statement } from 'delib-npm';

// Icons
import SendIcon from '@/view/components/icons/SendIcon';

// Redux Store
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import { userSelector } from '@/model/users/userSlice';
import useDirection from '@/controllers/hooks/useDirection';
import { handleAddStatement } from './StatementInputCont';
import useStatementColor from '@/controllers/hooks/useStatementColor';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface Props {
	statement: Statement;
}

const StatementInput: FC<Props> = ({ statement }) => {
	if (!statement) throw new Error('No statement');

	// Redux hooks
	const { t } = useLanguage();
	const user = useAppSelector(userSelector);

	const { deliberativeElement, isResult } = statement;
	const statementColor = useStatementColor({ deliberativeElement, isResult });

	const direction = useDirection();
	const [message, setMessage] = useState('');

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, []);

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
	};

	return (
		<form
			onSubmit={(e) => handleSubmitInput(e)}
			name="theForm"
			className={styles.form}
			style={{ flexDirection: direction }}
		>
			<textarea
				style={{ borderTop: `2px solid ${statementColor.backgroundColor}` }}
				data-cy="statement-chat-input"
				className={styles.textarea}
				aria-label="Form Input"
				name="newStatement"
				ref={textareaRef}
				onKeyUp={(e) => handleKeyUp(e)}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				required
				placeholder={t('Type your message here...')}
			></textarea>
			<button
				type="submit"
				className={styles.send}
				aria-label="Submit Button"
				style={statementColor}
				data-cy="statement-chat-send-btn"
			>
				<SendIcon color={statementColor.color} />
			</button>
		</form>
	);
};

export default StatementInput;
