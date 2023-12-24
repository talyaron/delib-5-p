import { FC } from "react";

// Third Party
import { Statement } from "delib-npm";

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
import LightBulbIcon from "../../../../../components/icons/LightBulbIcon";

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
            <LightBulbIcon
                color={isOptionFn(statement) ? "orange" : "lightgray"}
            />
        </div>
    );
};

export default StatementChatSetOption;
