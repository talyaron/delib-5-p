import { FC } from "react";

// Third party
import { Statement } from "delib-npm";

// Statements Helpers
import { updateStatementText } from "../../../functions/db/statements/setStatments";

// Styles
import styles from "./EditTitle.module.scss";

// Custom components
import Text from "../text/Text";

// import { statementTitleToDisplay } from "../../../functions/general/helpers";

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

        function handleSetTitle(e: any) {
            try {
                if (
                    e.type === "blur" ||
                    (e.key === "Enter" && e.shiftKey === false)
                ) {
                    const inputString = e.target.value;

                    if (inputString === title) return setEdit(false);
                    if (!inputString) return;

                    if (!statement) throw new Error("statement is undefined");

                    if (isTextArea) {
                        updateStatementText(statement, e.target.value);
                    } else {
                        const statementTitle = inputString + "\n" + description;

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
                    onBlur={handleSetTitle}
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
                    onBlur={handleSetTitle}
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
