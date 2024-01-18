import { FC, useState } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Icons
import SendIcon from "../../../../../../components/icons/SendIcon";

// Redux Store
import { useAppSelector } from "../../../../../../../functions/hooks/reduxHooks";
import { userSelector } from "../../../../../../../model/users/userSlice";
import useDirection from "../../../../../../../functions/hooks/useDirection";
import { handleAddStatement } from "./StatementInputCont";
import useStatementColor from "../../../../../../../functions/hooks/useStatementColor";
import {
    statementNotificationSelector,
    statementSubscriptionSelector,
} from "../../../../../../../model/statements/statementsSlice";

interface Props {
    statement: Statement;
    setAskNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatementInput: FC<Props> = ({ statement, setAskNotifications }) => {
    if (!statement) throw new Error("No statement");

    // Redux hooks
    const user = useAppSelector(userSelector);
    const hasNotifications = useAppSelector(
        statementNotificationSelector(statement.statementId),
    );

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.statementId),
    );

    const statementColor = useStatementColor(statement.statementType || "");

    const direction = useDirection();
    const [message, setMessage] = useState("");

    function handleKeyUp(e: any) {
        try {
            const _isMobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                )
                    ? true
                    : false;

            if (e.key === "Enter" && !e.shiftKey && !_isMobile) {
                handleSubmitInput(e);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmitInput = (e: any) => {
        e.preventDefault();

        // Create statement
        handleAddStatement(message, statement, user);

        setMessage(""); // Clear input

        // Ask for notifications after user interaction.
        if (
            !hasNotifications &&
            !statementSubscription?.userAskedForNotification
        ) {
            setAskNotifications(true);
        }
    };

    return (
        <form
            onSubmit={handleSubmitInput}
            name="theForm"
            className="statement__form"
            style={{ flexDirection: direction }}
        >
            <button
                type="submit"
                className="statement__form__sendBtnBox"
                style={statementColor}
            >
                <SendIcon color={statementColor.color} />
            </button>
            <textarea
                style={{ height: "4rem" }}
                className="statement__form__input"
                name="newStatement"
                onKeyUp={handleKeyUp}
                autoFocus={true}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
            />
        </form>
    );
};

export default StatementInput;
