import { FC, useState } from "react";

// Third Party Imports
import { Statement, StatementType } from "delib-npm";

// Custom Components
import StatementChatMore from "./StatementChatMore";
import StatementChatSetOption from "./components/StatementChatSetOption";
import ProfileImage from "./components/ProfileImage";
import EditTitle from "../../../../components/edit/EditTitle";
import StatementChatSetQuestion from "./components/StatementChatSetQuestion";

// Redux Store
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks";
import { store } from "../../../../../model/store";
import { statementSubscriptionSelector } from "../../../../../model/statements/statementsSlice";
import { bubbleclass } from "./StatementChatCont";
import StatementChatSetEdit from "../../../../components/edit/SetEdit";
import {
    isAuthorized,
    isOptionFn,
    isStatementTypeAllowed,
    linkToChildren,
} from "../../../../../functions/general/helpers";

import AddSubQuestion from "./components/addSubQuestion/AddSubQuestion";
import { useNavigate } from "react-router";

interface Props {
    statement: Statement;
    parentStatement: Statement;
    showImage: Function;
    setShowModal?: Function;
}

const StatementChat: FC<Props> = ({
    statement,
    parentStatement,
    showImage,
}) => {
    const navigate = useNavigate();
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

    const [isEdit, setIsEdit] = useState(false);

    function handleGoToStatement() {
        if (!isEdit && (parentStatement.hasChildren || isQuestion))
            navigate(`/statement/${statement.statementId}/chat`);
    }

    // console.log(
    //     "is option",
    //     isOption,
    //     "can have children",
    //     parentStatement.hasChildren
    // );
    // console.log(statement);

    return (
        <div
            className={
                isMe
                    ? `statement__chatCard statement__chatCard--me`
                    : "statement__chatCard statement__chatCard--other"
            }
        >
            <div className="statement__chatCard__left">
                <ProfileImage statement={statement} showImage={showImage} />
            </div>

            <div
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
                        <div className="statement__bubble__text__text">
                            <EditTitle
                                statement={statement}
                                isEdit={isEdit}
                                setEdit={setIsEdit}
                                isTextArea={true}
                            />
                        </div>
                    </div>
                    {isStatementTypeAllowed(parentStatement, statement) && (
                        <AddSubQuestion statement={statement} />
                    )}
                    {linkToChildren(statement, parentStatement) && (
                        <div className="statement__bubble__more">
                            <StatementChatMore statement={statement} />
                        </div>
                    )}
                </div>
            </div>
            <div className="statement__chatCard__right">
                {_isAuthrized &&
                !isQuestion &&
                parentStatement.statementType === StatementType.question ? (
                    <StatementChatSetOption statement={statement} />
                ) : null}
                {_isAuthrized ? (
                    <StatementChatSetQuestion statement={statement} />
                ) : null}

                <StatementChatSetEdit
                    isAuthrized={_isAuthrized}
                    setEdit={setIsEdit}
                    edit={isEdit}
                />
            </div>
        </div>
    );
};

export default StatementChat;
