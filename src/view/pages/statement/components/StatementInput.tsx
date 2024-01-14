import { FC } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Helpers
import {
    createStatement,
    setStatmentToDB,
} from "../../../../functions/db/statements/setStatments";

// Icons
import SendIcon from "../../../components/icons/SendIcon";

// Redux Store
import { useAppSelector } from "../../../../functions/hooks/reduxHooks";
import { userSelector } from "../../../../model/users/userSlice";
import useDirection from "../../../../functions/hooks/useDirection";
import { handleAddStatement } from "./StatementInputCont";
import useStatementColor from "../../../../functions/hooks/useStatementColor";

interface Props {
    statement: Statement;
}

const StatementInput: FC<Props> = ({ statement }) => {
    if (!statement) throw new Error("No statement");
    const user = useAppSelector(userSelector);

    const statementColor = useStatementColor(statement.statementType || "");

    const direction = useDirection();

    function handleInput(e: any) {
        try {
            const _isMobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                )
                    ? true
                    : false;

            if (e.key === "Enter" && !e.shiftKey && !_isMobile) {
                const _value = e.target.value.replace(/\s+/g, " ").trim();
                if (!_value) {
                    e.target.value = "";

                    return;
                }

                // submit form
                if (!user) throw new Error("No user");

                const newStatement: Statement | undefined = createStatement({
                    text: e.target.value,
                    parentStatement: statement,
                });

                if (!newStatement) throw new Error("No statement");

                setStatmentToDB({
                    statement: newStatement,
                    parentStatement: statement,
                    addSubscription: true,
                });
                e.target.value = "";
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form
            onSubmit={(e) => handleAddStatement(e, statement, user)}
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
                rows={3}
                className="statement__form__input"
                name="newStatement"
                onKeyUp={handleInput}
                required
                autoFocus={true}
                onFocus={(e) => {
                    e.preventDefault();
                }}
            />
        </form>
    );
};

export default StatementInput;
