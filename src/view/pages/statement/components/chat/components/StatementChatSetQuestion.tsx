import { FC } from "react";

// Third party
import { Statement } from "delib-npm";
import { AiOutlineQuestionCircle } from "react-icons/ai";

// Statements functions
import { updateIsQuestion } from "../../../../../../functions/db/statements/setStatments";

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
            <AiOutlineQuestionCircle
                size="1.5rem"
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
