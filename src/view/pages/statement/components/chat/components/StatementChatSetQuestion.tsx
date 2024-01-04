import { FC } from "react";

// Third party
import { Statement } from "delib-npm";

// Statements functions
import { updateIsQuestion } from "../../../../../../functions/db/statements/setStatments";

// Custom components
import QuestionMarkIcon from "../../../../../components/icons/QuestionMarkIcon";

interface Props {
    statement: Statement;
    text?: string;
}

const StatementChatSetQuestion: FC<Props> = ({ statement, text }) => {
    function handleSetQuestion() {
        updateIsQuestion(statement);
    }

    return (
        <>
        {text&& <span className="clickable" onClick={handleSetQuestion}>{text}</span>}
        <div className="clickable" onClick={handleSetQuestion}>
            <QuestionMarkIcon
                color={
                    statement.statementType === "question"
                        ? "blue"
                        : "lightgray"
                }
            />
        </div>
        </>
    );
};

export default StatementChatSetQuestion;
