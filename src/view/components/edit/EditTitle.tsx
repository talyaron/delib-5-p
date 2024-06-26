import { FC, useState } from "react";

// Third party
import { Statement } from "delib-npm";

// Statements Helpers
import { updateStatementText } from "../../../controllers/db/statements/setStatements";

// Styles
import styles from "./EditTitle.module.scss";

// Custom components
import Text from "../text/Text";

// Import the SaveTextIcon
import SaveTextIcon from "../../../assets/icons/SaveTextIcon.png";

interface Props {
	statement: Statement | undefined;
	isEdit: boolean;
	setEdit: React.Dispatch<React.SetStateAction<boolean>>;
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
	const [showSaveIconButton, setShowSaveIconButton] = useState(false);

	if (!statement) return null;

	const direction = document.body.style.direction as "ltr" | "rtl";
	const align = direction === "ltr" ? "left" : "right";

	const title = text.split("\n")[0];
	const description = text.split("\n").slice(1).join("\n");

	function handleTextChange(
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) {
		setText(e.target.value);
		setShowSaveIconButton(true);
	}

	function handleSave() {
		try {
			if (!text.trim()) return; // Do not save if the text is empty

			if (!statement) throw new Error("Statement is undefined");

			const updatedText = isTextArea
				? text.trim()
				: title.trim() + "\n" + description.trim();

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
		<div>
			{isTextArea ? (
				<textarea
					style={{ direction: direction, textAlign: align }}
					className={styles.textarea}
					value={text}
					onChange={handleTextChange}
					autoFocus={true}
					placeholder="Add text"
				/>
			) : (
				<div className={styles.inputWrapper}>
					<input
						style={{ direction: direction, textAlign: align }}
						className={styles.input}
						type="text"
						value={text}
						onChange={handleTextChange}
						autoFocus={true}
						data-cy="edit-title-input"
					/>
					<img
						src={SaveTextIcon}
						onClick={handleSave}
						className={styles.icon}
						alt="Icon"
					/>
				</div>
			)}
		</div>
	);
};

export default EditTitle;
