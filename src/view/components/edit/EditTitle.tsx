import { FC } from "react";

// Third party
import { Statement } from "delib-npm";

// Statements Helpers
import { updateStatementText } from "../../../controllers/db/statements/setStatements";

// Styles
import styles from "./EditTitle.module.scss";

// Custom components
import Text from "../text/Text";

// import { statementTitleToDisplay } from "../../../controllers/general/helpers";

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
	try {
		if (!statement) return null;

		const direction = document.body.style.direction as "ltr" | "rtl";
		const align = direction === "ltr" ? "left" : "right";

		const title = statement.statement.split("\n")[0];
		const description = statement.statement.split("\n").slice(1).join("\n");

		function handleSetTitle(
			e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
		) {
			try {
				if (
					e.type === "blur" ||
                    (e.key === "Enter" && e.shiftKey === false)
				) {
					const target = e.target as
                        | HTMLTextAreaElement
                        | HTMLInputElement;

					if (target.value === title) return setEdit(false);

					if (!target) return;

					if (!statement) throw new Error("statement is undefined");

					if (isTextArea) {
						updateStatementText(statement, target.value);
					} else {
						const statementTitle =
                            target.value + "\n" + description;

						//update title in db
						updateStatementText(statement, statementTitle);
					}

					setEdit(false);
				}
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

		if (isTextArea) {
			return (
				<textarea
					style={{ direction: direction, textAlign: align }}
					className={styles.textarea}
					defaultValue={statement.statement}
					onKeyUp={handleSetTitle}
					autoFocus={true}
				/>
			);
		} else {
			return (
				<input
					style={{ direction: direction, textAlign: align }}
					className={styles.input}
					type="text"
					defaultValue={title}
					onKeyUp={handleSetTitle}
					autoFocus={true}
					data-cy="edit-title-input"
				/>
			);
		}
	} catch (error) {
		console.error(error);

		return null;
	}
};

export default EditTitle;
