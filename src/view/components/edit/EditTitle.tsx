import {
	ChangeEvent,
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";

// Third party
import { Statement } from "delib-npm";

// Statements Helpers
import { updateStatementText } from "@/controllers/db/statements/setStatements";

// Styles
import styles from "./EditTitle.module.scss";
import Save from "@/assets/icons/saveIcon.svg?react";

// Custom components
import Text from "../text/Text";
import { getDescription, getTitle } from "@/controllers/general/helpers";
import { useLanguage } from "@/controllers/hooks/useLanguages";

interface Props {
  statement: Statement | undefined;
  isEdit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
  isTextArea?: boolean;
  onlyTitle?: boolean;
}

const EditTitle: FC<Props> = ({
	statement,
	isEdit,
	setEdit,
	isTextArea,
	onlyTitle,
}) => {
	const [text, setText] = useState(statement?.statement || "");
	const [title, setTitle] = useState(getTitle(statement) || "");
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	if (!statement) return null;

	const { dir: direction } = useLanguage();

	const align = direction === "ltr" ? "left" : "right";

	useEffect(() => {
		if (isEdit && textareaRef.current) {
			const length = textareaRef.current.value.length;
			textareaRef.current.focus();
			textareaRef.current.setSelectionRange(length, length);
		}
	}, [isEdit]);

	function handleChange(
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
		setState: Dispatch<SetStateAction<string>>
	) {
		setState(e.target.value);
	}

	function handleSave() {
		try {
			if (!text.trim()) return; // Do not save if the text is empty

			if (!statement) throw new Error("Statement is undefined");

			const description = getDescription(statement);

			const updatedText = isTextArea
				? text.trim()
				: title + "\n" + description.trim();

			updateStatementText(statement, updatedText);
			setEdit(false);
		} catch (error) {
			console.error(error);
		}
	}

	if (!isEdit)
		return (
			<div style={{ direction: direction, textAlign: align }}>
				<Text text={statement.statement} onlyTitle={onlyTitle} />
			</div>
		);

	return (
		<div className={styles.container}>
			{isTextArea ? (
				<>
					<textarea
						ref={textareaRef}
						style={{ direction: direction, textAlign: align }}
						className={styles.textarea}
						value={text}
						onChange={(e) => handleChange(e, setText)}
						autoFocus={true}
						placeholder="Add text"
					></textarea>
					<button className={styles.save} onClick={handleSave}>
						<Save />
					</button>
				</>
			) : (
				<>
					<input
						style={{ direction: direction, textAlign: align }}
						className={styles.input}
						type="text"
						value={title}
						onChange={(e) => handleChange(e, setTitle)}
						autoFocus={true}
						data-cy="edit-title-input"
					></input>
					<button
						className={styles.save}
						onClick={handleSave}
						style={{ left: direction === "rtl" ? "-1.4rem" : "none" }}
					>
						<Save />
					</button>
				</>
			)}
		</div>
	);
};

export default EditTitle;
