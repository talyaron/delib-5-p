import { FC } from "react";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { Statement } from "delib-npm";
import { setStatementisOption } from "../../../../../../functions/db/statements/setStatments";

import { isOptionFn } from "../../../../../../functions/general/helpers";

interface Props {
    statement: Statement;
}

const StatementChatSetOption: FC<Props> = ({ statement }) => {
    function handleSetOption() {
        try {
            if (statement.statementType === "option") {
                const cancelOption = window.confirm(
                    "Are you sure you want to cancel this option?"
                );
                if (cancelOption) {
                    setStatementisOption(statement);
                }
            } else {
                setStatementisOption(statement);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="clickable" onClick={handleSetOption}>
            {" "}
            <LightbulbIcon
                htmlColor={isOptionFn(statement) ? "orange" : "lightgray"}
            />
        </div>
    );
};

export default StatementChatSetOption;
