import { Statement } from 'delib-npm';
import {
	ChangeEvent,
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';

// Third party

// Statements Helpers
import Text from '../text/Text';
import styles from './EditTitle.module.scss';
import Save from '@/assets/icons/saveIcon.svg?react';
import { updateStatementText } from '@/controllers/db/statements/setStatements';

// Styles

// Custom components
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface Props {
	statement: Statement | undefined;
	isEdit: boolean;
	setEdit: Dispatch<SetStateAction<boolean>>;
	isTextArea?: boolean;
	useTitle?: boolean;
	useDescription?: boolean;
	useDescription?: boolean;
}

const EditTitle: FC<Props> = ({ useTitle = true, useDescription = true, statement, isEdit, setEdit, isTextArea }) => {
	const [description, setDescription] = useState(statement?.description || '');
	const [title, setTitle] = useState(statement?.statement || '');

	// Single ref for both textarea and input
	const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

	// Manage focus when editing starts
	useEffect(() => {
		if (isEdit && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEdit]);

	if (!statement) return null;

	const { dir: direction } = useLanguage();
	const align = direction === 'ltr' ? 'left' : 'right';

	function handleChange(
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) {
		const _title = e.target.value.split('\n')[0];
		const _description = e.target.value.split('\n').slice(1).join('\n');
		setTitle(_title);
		setDescription(_description);
	}

	function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			handleSave();
		}
	}

	function handleSave() {
		try {
			if (!title) return; // Do not save if the text is empty
			if (!statement) throw new Error('Statement is undefined');

			updateStatementText(statement, title, description);
			setEdit(false);
		} catch (error) {
			console.error(error);
		}
	}

	if (!isEdit) {
		return (
			<div style={{ direction: direction, textAlign: align }}>
				<Text
					statement={useTitle && statement.statement}
					description={useDescription && statement.description}
				/>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			{isTextArea ? (
				<>
					<textarea
						ref={inputRef as React.RefObject<HTMLTextAreaElement>}
						style={{ direction: direction, textAlign: align }}
						className={styles.textarea}
						defaultValue={`${title}\n${description}`}
						onChange={handleChange}
						placeholder='Add text'
					></textarea>
					<button
						className={styles.save}
						onClick={handleSave}
						aria-label='Save'
					>
						<Save />
					</button>
				</>
			) : (
				<>
					<input
						ref={inputRef as React.RefObject<HTMLInputElement>}
						style={{ direction: direction, textAlign: align }}
						className={styles.input}
						type='text'
						defaultValue={title}
						onChange={handleChange}
						onKeyUp={handleEnter}
						data-cy='edit-title-input'
					/>
					<button
						className={styles.save}
						onClick={handleSave}
						style={{ left: direction === 'rtl' ? '-1.4rem' : 'none' }}
						aria-label='Save'
					>
						<Save />
					</button>
				</>
			)}
		</div>
	);
};

export default EditTitle;
