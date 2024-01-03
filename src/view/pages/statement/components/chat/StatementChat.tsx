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
import MoreIcon from "../../../../../assets/icons/MoreIcon";
import useStatementColor from "../../../../../functions/hooks/useStatementColor";
import { t } from "i18next";
import PopUpMenu from "../../../../components/popUpMenu/PopUpMenu";
import QuestionMarkIcon from "../../../../components/icons/QuestionMarkIcon";
import {
    setStatementisOption,
    updateIsQuestion,
} from "../../../../../functions/db/statements/setStatments";
import LightBulbIcon from "../../../../components/icons/LightBulbIcon";

interface Props {
    statement: Statement;
    showImage: Function;
    setShowModal?: Function;
    index: number;
    previousStatement: Statement | undefined;
}

const StatementChat: FC<Props> = ({
    statement,
    showImage,
    index,
    previousStatement,
}) => {
    const { statementType } = statement;

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.parentId)
    );
    const userId = store.getState().user.user?.uid;

    const statementColor = useStatementColor(statement);

    const creatorId = statement.creatorId;
    const _isAuthrized = isAuthorized(statement, statementSubscription);

    const isMe = userId === creatorId;
    const isQuestion = statementType === StatementType.question;
    const isOption = isOptionFn(statement);

    const displayChat = isQuestion || isOption;

    const [isEdit, setIsEdit] = useState(false);

    const displayUserName = !previousStatement
        ? true
        : previousStatement.creatorId !== statement.creatorId
        ? true
        : false;

    function handleSetQuestion() {
        updateIsQuestion(statement);
    }

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

    const optionIcon = (
        <div className="clickable">
            {isOptionFn(statement) ? (
                <LightBulbIcon color="gold" />
            ) : (
                <LightBulbIcon color="lightgray" />
            )}
        </div>
    );

    return (
        <div className={isMe ? "message message--me" : "message"}>
            {displayUserName && (
                <div className="message__user">
                    <ProfileImage statement={statement} showImage={showImage} />
                    <span>{statement.creator.displayName}</span>
                </div>
            )}

            <div className={`message__box ${statementType}`}>
                {displayUserName && (
                    <div
                        className={
                            isMe
                                ? "message__box__triangle--me"
                                : "message__box__triangle"
                        }
                    />
                )}
                <div className="message__box__info">
                    <EditTitle
                        statement={statement}
                        isEdit={isEdit}
                        setEdit={setIsEdit}
                        isTextArea={true}
                    />
                    <PopUpMenu
                        isAuthrized={_isAuthrized}
                        unAuthrizedIcon={
                            <AddSubQuestion statement={statement} />
                        }
                        openMoreIconColor={statementColor.color}
                        firstIcon={<AddSubQuestion statement={statement} />}
                        firstIconText="Add Sub-Question"
                        secondIcon={
                            <QuestionMarkIcon
                                color={
                                    statement.statementType === "question"
                                        ? "blue"
                                        : "lightgray"
                                }
                            />
                        }
                        secondIconFunc={handleSetQuestion}
                        secondIconText="Question"
                        thirdIcon={optionIcon}
                        thirdIconFunc={handleSetOption}
                        thirdIconText="Option"
                        fourthIcon={
                            <StatementChatSetEdit
                                isAuthrized={_isAuthrized}
                                setEdit={setIsEdit}
                                edit={isEdit}
                            />
                        }
                        fourthIconText="Edit"
                    />
                </div>
                {displayChat && (
                            <StatementChatMore statement={statement} />
                        )}

                <div className="message__box__actions">
                    <div className="message__box__actions__type">
                    </div>
                    <div className="message__box__actions__evaluations">
                        <Evaluation
                            statement={statement}
                            displayScore={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatementChat;
