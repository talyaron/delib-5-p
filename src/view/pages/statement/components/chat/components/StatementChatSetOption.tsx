import { FC } from "react";

// Third Party
import { Statement, StatementType } from "delib-npm";

// Statement Helpers
import { setStatementisOption } from "../../../../../../functions/db/statements/setStatments";
import {
    isAuthorized,
    isOptionFn,
} from "../../../../../../functions/general/helpers";

// Redux Store
import { useAppSelector } from "../../../../../../functions/hooks/reduxHooks";
import { statementSubscriptionSelector } from "../../../../../../model/statements/statementsSlice";

// Icons
import LightBulbIcon from "../../../../../../assets/icons/lightBulbIcon.svg?react";
import IconButton from "../../../../../components/iconButton/IconButton";

interface Props {
    parentStatement: Statement | null;
    statement: Statement;
    text?: string;
}

const StatementChatSetOption: FC<Props> = ({
    statement,
    text,
    parentStatement,
}) => {
    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.statementId),
    );

    const _isAuthorized = isAuthorized(
        statement,
        statementSubscription,
        parentStatement?.creatorId,
    );

    function handleSetOption() {
        try {
            if (statement.statementType === "option") {
                const cancelOption = window.confirm(
                    "Are you sure you want to cancel this option?",
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
    if (!_isAuthorized) return null;
    if (statement.statementType === StatementType.question) return null;

    return (
        <>
            {text && (
                <span className="clickable" onClick={handleSetOption}>
                    {text}
                </span>
            )}
            <IconButton
                onClick={handleSetOption}
                data-cy="chat-option-lightbulb"
            >
                <LightBulbIcon
                    style={{
                        color: isOptionFn(statement) ? "#226CBC" : "lightgray",
                    }}
                />
            </IconButton>
        </>
    );
};

export default StatementChatSetOption;
