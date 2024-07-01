import { FC, useState } from "react";

// Third party
import { Statement } from "delib-npm";

// Statements Helpers
import { updateStatementText } from "../../../controllers/db/statements/setStatements";

// Styles
import styles from "./EditTitle.module.scss";

// Custom components
import Text from "../text/Text";
import { getDescription, getTitle } from "../../../controllers/general/helpers";

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
  const [text, setText] = useState(statement?.statement || "");
  const [title, setTitle] = useState(getTitle(statement) || "");

  if (!statement) return null;

  const direction = document.body.style.direction as "ltr" | "rtl";
  const align = direction === "ltr" ? "left" : "right";

  function handleChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
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
    <div>
      {isTextArea ? (
        <textarea
          style={{ direction: direction, textAlign: align }}
          className={styles.textarea}
          value={text}
          onChange={(e) => handleChange(e, setText)}
          autoFocus={true}
          placeholder="Add text"
        />
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
          />

          <button
            className="editTitle-btn btn btn--agree btn--small"
            onClick={handleSave}
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default EditTitle;
