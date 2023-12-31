import { FC } from "react";

// Third party
import { Statement } from "delib-npm";

// Statements functions
import { updateIsQuestion } from "../../../../../../functions/db/statements/setStatments";

// Custom components
import QuestionMarkIcon from "../../../../../components/icons/QuestionMarkIcon";

interface Props {
    statement: Statement;
}

const StatementChatSetQuestion: FC<Props> = ({ statement }) => {
    function handleSetQuestion() {
        updateIsQuestion(statement);
    }

    return (
        <div className="clickable" onClick={handleSetQuestion}>
            {/* <HelpOutlineIcon
                htmlColor={isOptionFn(statement) ? "blue" : "lightgray"}
            /> */}
            <QuestionMarkIcon
                color={
                    statement.statementType === "question"
                        ? "blue"
                        : "lightgray"
                }
            />
        </div>
    );
};

export default StatementChatSetQuestion;
