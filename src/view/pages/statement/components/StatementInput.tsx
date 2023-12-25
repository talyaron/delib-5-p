import { FC } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Helpers
import { setStatmentToDB } from "../../../../functions/db/statements/setStatments";
import { getNewStatment } from "../../../../functions/general/helpers";

// Icons
import SendIcon from "../../../components/icons/SendIcon";

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

               

                setStatmentToDB(newStatement);
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
            <button type="submit" className="statement__form__sendBtnBox">
                {/* <MdSend
                    color="white"
                    size="1.5rem"
                    style={{
                        transform: "rotate(180deg) translateX(5%)",
                        zIndex: 1,
                    }}
                /> */}
                <div
                    style={{
                        transform: "rotate(180deg) translateX(5%)",
                        zIndex: 1,
                    }}
                >
                    <SendIcon />
                </div>
            </button>
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
