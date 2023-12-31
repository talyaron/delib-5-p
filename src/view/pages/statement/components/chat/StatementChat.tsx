import { FC, useState } from "react";

// Third Party Imports
import { Statement, StatementType } from "delib-npm";

// Custom Components
import StatementChatMore from "./StatementChatMore";
import StatementChatSetOption from "./components/StatementChatSetOption";
import ProfileImage from "./components/ProfileImage";
import EditTitle from "../../../../components/edit/EditTitle";
import StatementChatSetQuestion from "./components/StatementChatSetQuestion";
import StatementChatSetEdit from "../../../../components/edit/SetEdit";
import AddSubQuestion from "./components/addSubQuestion/AddSubQuestion";
import Evaluation from "../../../../components/evaluation/Evaluation";

// Redux Store
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks";
import { store } from "../../../../../model/store";
import { statementSubscriptionSelector } from "../../../../../model/statements/statementsSlice";

// Helper functions
import {
    isAuthorized,
    isOptionFn,
} from "../../../../../functions/general/helpers";

interface Props {
    statement: Statement;
    showImage: Function;
    setShowModal?: Function;
}

const StatementChat: FC<Props> = ({ statement, showImage }) => {
    const { statementType } = statement;

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.parentId)
    );
    const userId = store.getState().user.user?.uid;

    const creatorId = statement.creatorId;
    const _isAuthrized = isAuthorized(statement, statementSubscription);

    const isMe = userId === creatorId;
    const isQuestion = statementType === StatementType.question;
    const isOption = isOptionFn(statement);

    const displayChat = isQuestion || isOption;

    const [isEdit, setIsEdit] = useState(false);

    return (
        <div className={isMe ? "message message--me" : "message"}>
            <div className="message__user">
                <ProfileImage statement={statement} showImage={showImage} />
                <span>{statement.creator.displayName}</span>
            </div>

            <div className={`message__box ${isQuestion && "isQuestion"}`}>
                <div
                    className={
                        isMe
                            ? "message__box__triangle--me"
                            : "message__box__triangle"
                    }
                ></div>
                <div className="message__box__info">
                    <EditTitle
                        statement={statement}
                        isEdit={isEdit}
                        setEdit={setIsEdit}
                        isTextArea={true}
                    />
                    <StatementChatSetEdit
                        isAuthrized={_isAuthrized}
                        setEdit={setIsEdit}
                        edit={isEdit}
                    />
                </div>

                {displayChat ? (
                    <StatementChatMore statement={statement} />
                ) : (
                    <div
                        style={{
                            backgroundColor: "var(--statementBackground)",
                            width: "100%",
                            height: 2,
                        }}
                    />
                )}
                <div className="message__box__actions">
                    <div className="message__box__actions__type">
                        <StatementChatSetOption statement={statement} />
                        <StatementChatSetQuestion statement={statement} />
                    </div>
                    <div className="message__box__actions__addQuestion">
                        <AddSubQuestion statement={statement} />
                    </div>
                    <div className="message__box__actions__evaluations">
                        <Evaluation
                            statement={statement}
                            displayScore={false}
                        />
                    </div>
                </div>
            </div>

            {/* <div
                className={
                    isOption
                        ? "statement__bubble statement__bubble--option"
                        : "statement__bubble"
                }
            >
                <div className={bubbleclass(isQuestion, isMe)}>
                    <div
                        className={
                            linkToChildren(statement, parentStatement)
                                ? "statement__bubble__text clickable"
                                : "statement__bubble__text"
                        }
                        onClick={handleGoToStatement}
                    >
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default StatementChat;
