import { FC } from "react";
import { MdLightbulb } from "react-icons/md";

import { Statement } from "delib-npm";
import { setStatementisOption } from "../../../../../../functions/db/statements/setStatments";

import {
    isAuthorized,
    isOptionFn,
} from "../../../../../../functions/general/helpers";
import { useAppSelector } from "../../../../../../functions/hooks/reduxHooks";
import { statementSubscriptionSelector } from "../../../../../../model/statements/statementsSlice";

interface Props {
    statement: Statement;
}

const StatementChatSetOption: FC<Props> = ({ statement }) => {
    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.statementId)
    );
    const _isAuthrized = isAuthorized(statement, statementSubscription);
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
    if (!_isAuthrized) return null;
    return (
        <div className="clickable" onClick={handleSetOption}>
            <MdLightbulb
                size="1.5rem"
                color={isOptionFn(statement) ? "orange" : "lightgray"}
            />
        </div>
    );
};

export default StatementChatSetOption;
