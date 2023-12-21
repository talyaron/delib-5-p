import { FC } from "react";

// Third Party Imports
import { Screen, Statement } from "delib-npm";

// Helpers
import { setStatmentToDB } from "../../../../functions/db/statements/setStatments";
import { getNewStatment } from "../../../../functions/general/helpers";

// MUI
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";

// Redux Store
import { useAppSelector } from "../../../../functions/hooks/reduxHooks";
import { userSelector } from "../../../../model/users/userSlice";
import useDirection from "../../../../functions/hooks/useDirection";
import { handleAddStatement } from "./StatementInputCont";

interface Props {
    statement: Statement;
}

const StatementInput: FC<Props> = ({ statement }) => {
    const user = useAppSelector(userSelector);

    const direction = useDirection();

    

    function handleInput(e: any) {
        try {
            const _isMobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
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

                const newStatement: Statement | undefined = getNewStatment({
                    value: e.target.value,
                    statement,
                    user,
                });

                if (!newStatement) throw new Error("No statement");

                newStatement.subScreens = [
                    Screen.CHAT,
                    Screen.EVALUATION,
                    Screen.VOTE,
                ];

                setStatmentToDB(newStatement);
                e.target.value = "";
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form
            onSubmit={e=>handleAddStatement(e, statement, user)}
            name="theForm"
            className="statement__form"
            style={{ flexDirection: direction }}
        >
            <div className="statement__form__sendBtnBox">
                <IconButton type="submit">
                    <SendIcon />
                </IconButton>
            </div>
            <textarea
                rows={3}
                className="statement__form__input"
                name="newStatement"
                onKeyUp={handleInput}
                required
                autoFocus={true}
            />
        </form>
    );
};

export default StatementInput;
