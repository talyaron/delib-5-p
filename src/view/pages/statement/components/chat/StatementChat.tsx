import { FC, useState } from "react";

// Third Party Imports
import { Statement, StatementType } from "delib-npm";

// Custom Components
import StatementChatMore from "./StatementChatMore";
import StatementChatSetOption from "./components/StatementChatSetOption";
import Text from "../../../../components/text/Text";
import ProfileImage from "./components/ProfileImage";
import EditTitle from "../../../../components/edit/EditTitle";
import StatementChatSetQuestion from "./components/StatementChatSetQuestion";

// Redux Store
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks";
import { store } from "../../../../../model/store";
import { statementSubscriptionSelector } from "../../../../../model/statements/statementsSlice";
import { bubbleclass } from "./StatementChatCont";
import StatementChatSetEdit from "./components/StatementChatSetEdit";
import {
    isAuthorized,
    isOptionFn,
} from "../../../../../functions/general/helpers";

import AddSubQuestion from "./components/addSubQuestion/AddSubQuestion";

interface Props {
    statement: Statement;
    showImage: Function;
    setShowModal?: Function;
}

const StatementChat: FC<Props> = ({
    statement,
    showImage,
    setShowModal = () => {},
}) => {
    const { statementType } = statement;

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.parentId)
    );

    // const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const userId = store.getState().user.user?.uid;
    const displayName = store.getState().user.user?.displayName;
    
    const creatorId = statement.creatorId;
    const _isAuthrized = isAuthorized(statement, statementSubscription);
        console.log(displayName, statement.statement, _isAuthrized)

    const isMe = userId === creatorId;
    const isQuestion = statementType === StatementType.question;
    const isOption = isOptionFn(statement);

    function handleEdit() {
        setShowModal((showModal: boolean) => !showModal);
    }

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
                        className="statement__bubble__text"
                        onClick={handleEdit}
                    >
                        <div className="statement__bubble__text__text">
                            {!isEdit ? (
                                <div>
                                    {" "}
                                    <Text text={statement.statement} />
                                </div>
                            ) : (
                                <EditTitle
                                    statement={statement}
                                    setEdit={setIsEdit}
                                    isTextArea={true}
                                />
                            )}
                        </div>
                    </div>
                    {statement.statementType === StatementType.option && (
                        <AddSubQuestion statement={statement} />
                    )}
                    {isQuestion || isOption ? (
                        <div className="statement__bubble__more">
                            <StatementChatMore statement={statement} />
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="statement__chatCard__right">
                {!_isAuthrized  || isQuestion ? null : (
                    <StatementChatSetOption statement={statement} />
                )}
                {!_isAuthrized || isOption ? null : (
                    <StatementChatSetQuestion statement={statement} />
                )}
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
