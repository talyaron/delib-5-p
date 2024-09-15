import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";

// Third party
import { Statement } from "delib-npm";

// Statements Helpers
import { updateStatementText } from "@/controllers/db/statements/setStatements";

// Styles
import Save from "@/assets/icons/saveIcon.svg?react";
import styles from "./EditTitle.module.scss";

// Custom components
import useAutoFocus from "@/controllers/hooks/useAutoFocus ";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import Text from "../text/Text";

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

}) => {
	const [description, setDescription] = useState(statement?.description || "");
	const [title, setTitle] = useState(statement?.statement || "");
	const textareaRef = useAutoFocus(isEdit);

	if (!statement) return null;

	const { dir: direction } = useLanguage();

	const align = direction === "ltr" ? "left" : "right";

	function handleChange(
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) {
		const _title = e.target.value.split("\n")[0]
		const _description = e.target.value.split("\n").slice(1).join("\n");
		setTitle(_title);
		setDescription(_description);
	}

	function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			handleSave();
		}
	}

	function handleSave() {
		try {
			if (!title) return; // Do not save if the text is empty
			if (!statement) throw new Error("Statement is undefined");


			updateStatementText(statement, title, description);
			setEdit(false);
		} catch (error) {
			console.error(error);
		}
	}

	if (!isEdit)
		return (
			<div style={{ direction: direction, textAlign: align }}>
				<Text statement={statement.statement} description={statement.description} />
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
						defaultValue={`${title}\n${description}`}
						onChange={handleChange}
						autoFocus={true}
						placeholder="Add text"
					></textarea>
					<button className={styles.save} onClick={handleSave} aria-label="Save">
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
						onChange={handleChange}
						onKeyUp={handleEnter}
						autoFocus={true}
						data-cy="edit-title-input"
					></input>
					<button
						className={styles.save}
						onClick={handleSave}
						style={{ left: direction === "rtl" ? "-1.4rem" : "none" }}
						aria-label="Save"
					>
						<Save />
					</button>
				</>
			)}
		</div>
	);
};

export default EditTitle;
