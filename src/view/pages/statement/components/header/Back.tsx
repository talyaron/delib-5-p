import { Screen, Statement } from "delib-npm";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../../../functions/db/config";
import { FC } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackArrowIcon from "../../../../../assets/icons/chevronLeftIcon.svg?react";
import { checkArrayAndReturnByOrder } from "../../../../../functions/general/helpers";
import { StyleProps } from "../../../../../functions/hooks/useStatementColor";

interface Props {
    parentStatement: Statement | undefined;
    statement: Statement | undefined;
    headerColor:StyleProps;
}

const Back: FC<Props> = ({ parentStatement, statement,headerColor }) => {
    const navigate = useNavigate();
    const { page } = useParams();
    const location = useLocation();
    const parentStatementScreens = parentStatement?.subScreens || [
        Screen.QUESTIONS,
        Screen.CHAT,
        Screen.HOME,
        Screen.VOTE,
        Screen.OPTIONS,
    ];
    function handleBack() {
        try {
            //google analytics log
            logEvent(analytics, "statement_back_button", {
                button_category: "buttons",
                button_label: "back_button",
            });

            //in case the back should diret to home
            if (statement?.parentId === "top") {
                return navigate("/home", {
                    state: { from: window.location.pathname },
                });
            }

            //in case the user is at doc or main pagesub screen
            if (location.state && location.state.from.includes("doc")) {
                return navigate(location.state.from, {
                    state: { from: window.location.pathname },
                });
            }

            //if in evaluation or in voting --> go back to question or chat
            if (page === Screen.OPTIONS || page === Screen.VOTE) {
                return navigate(
                    `/statement/${statement?.parentId}/${checkArrayAndReturnByOrder(parentStatementScreens, Screen.QUESTIONS, Screen.CHAT)}`,
                    {
                        state: { from: window.location.pathname },
                    },
                );
            }

            //default case
            return navigate(`/statement/${statement?.parentId}/${page}`, {
                state: { from: window.location.pathname },
            });
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <button
            className="page__header__wrapper__actions__iconButton"
            onClick={handleBack}
            style={{ cursor: "pointer" }}
            data-cy="back-icon-header"
        >
            <BackArrowIcon
                className="back-arrow-icon"
                style={{
                    color: headerColor.color,
                }}
            />
        </button>
    );
};

export default Back;
