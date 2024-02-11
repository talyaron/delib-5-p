import { FC, useState } from "react";

// Third Party Imports
import { Statement, StatementType, User } from "delib-npm";
import { t } from "i18next";

// Redux Store
import { useAppSelector } from "../../../../../../functions/hooks/reduxHooks";
import { store } from "../../../../../../model/store";
import { statementSubscriptionSelector } from "../../../../../../model/statements/statementsSlice";

// Helper functions
import {
    isAuthorized,
    isOptionFn,
    linkToChildren,
} from "../../../../../../functions/general/helpers";

// Hooks
import useStatementColor from "../../../../../../functions/hooks/useStatementColor";
import { useNavigate } from "react-router";

// Custom Components
import StatementChatMore from "./StatementChatMore";
import ProfileImage from "./ProfileImage";
import EditTitle from "../../../../../components/edit/EditTitle";
import StatementChatSetEdit from "../../../../../components/edit/SetEdit";
import AddSubQuestion from "./addSubQuestion/AddSubQuestion";
import Evaluation from "../../../../../components/evaluation/Evaluation";
import CardMenu from "../../../../../components/cardMenu/CardMenu";
import StatementChatSetOption from "./StatementChatSetOption";
import StatementChatSetQuestion from "./StatementChatSetQuestion";
import NewSetStatementSimple from "../../set/NewStatementSimple";
import Modal from "../../../../../components/modal/Modal";

export interface NewQuestion {
    statement: Statement;
    isOption: boolean;
    showModal: boolean;
}

interface Props {
    parentStatement: Statement;
    statement: Statement;
    showImage: (statement: User | null) => void;
    index: number;
    previousStatement: Statement | undefined;
}

const StatementChatCard: FC<Props> = ({
    parentStatement,
    statement,
    showImage,
    previousStatement,
}) => {
    // Hooks
    const navigate = useNavigate();
    const { statementType } = statement;
    const statementColor = useStatementColor(statementType || "");

    // Redux store
    const userId = store.getState().user.user?.uid;
    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.parentId),
    );

    // Use States
    const [isEdit, setIsEdit] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Variables
    const creatorId = statement.creatorId;
    const _isAuthrized = isAuthorized(
        statement,
        statementSubscription,
        parentStatement.creatorId,
    );

    const isMe = userId === creatorId;
    const isQuestion = statementType === StatementType.question;
    const isOption = isOptionFn(statement);

    const displayChat = (isQuestion || isOption) && parentStatement.hasChildren;

    const displayUserName = !previousStatement
        ? true
        : previousStatement.creatorId !== statement.creatorId
          ? true
          : false;

    function handleGoToOption() {
        if (!isEdit && linkToChildren(statement, parentStatement))
            navigate(`/statement/${statement.statementId}/chat`);
    }

    return (
        <div className={isMe ? "message message--me" : "message"}>
            {displayUserName && (
                <div className="message__user">
                    <ProfileImage statement={statement} showImage={showImage} />
                    <span>{statement.creator.displayName}</span>
                </div>
            )}

            <div
                className="message__box"
                style={
                    isMe
                        ? {
                              borderRight: `.65rem solid ${statementColor.backgroundColor}`,
                          }
                        : {
                              borderLeft: `.65rem solid ${statementColor.backgroundColor}`,
                          }
                }
            >
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
                    <CardMenu isMe={isMe}>
                        <StatementChatSetEdit
                            isAuthrized={_isAuthrized}
                            setEdit={setIsEdit}
                            edit={isEdit}
                            text={t("Edit Text")}
                        />

                        <StatementChatSetQuestion
                            statement={statement}
                            text={t("Question")}
                        />

                        {linkToChildren(statement, parentStatement) && (
                                <AddSubQuestion
                                    statement={statement}
                                    setShowModal={setShowModal}
                                    text={t("Add Question")}
                                />
                            )}
                        <StatementChatSetOption
                            parentStatement={parentStatement}
                            statement={statement}
                            text={t("Option")}
                        />
                    </CardMenu>
                    <div
                        className={
                            linkToChildren(statement, parentStatement)
                                ? "message__box__info__text clickable"
                                : "message__box__info__text"
                        }
                        onClick={handleGoToOption}
                    >
                        <EditTitle
                            statement={statement}
                            isEdit={isEdit}
                            setEdit={setIsEdit}
                            isTextArea={true}
                        />
                    </div>
                </div>
                {displayChat && <StatementChatMore statement={statement} />}

                <div className="message__box__actions">
                    <div className="message__box__actions__type"></div>
                    <div className="message__box__actions__evaluations">
                        <Evaluation
                            statement={statement}
                            displayScore={false}
                        />
                    </div>
                </div>
            </div>
            {showModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatement={statement}
                        isOption={false}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default StatementChatCard;
