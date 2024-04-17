import { FC, useState } from "react";

// Third Party Imports
import { Statement, StatementType, User } from "delib-npm";

// Redux Store
import { useAppSelector } from "../../../../../../../functions/hooks/reduxHooks";
import { store } from "../../../../../../../model/store";
import { statementSubscriptionSelector } from "../../../../../../../model/statements/statementsSlice";

// Helper functions
import {
    isAuthorized,
    isOptionFn,
    linkToChildren,
} from "../../../../../../../functions/general/helpers";

// Hooks
import useStatementColor from "../../../../../../../functions/hooks/useStatementColor";

// Custom Components
import StatementChatMore from "../StatementChatMore";
import ProfileImage from "../ProfileImage";
import EditTitle from "../../../../../../components/edit/EditTitle";
import StatementChatSetEdit from "../../../../../../components/edit/SetEdit";
import AddSubQuestion from "../addSubQuestion/AddSubQuestion";

// import Evaluation from "../../../../../components/evaluation/simpleEvaluation/SimplEvaluation";
import CardMenu from "../../../../../../components/cardMenu/CardMenu";
import StatementChatSetOption from "../StatementChatSetOption";
import StatementChatSetQuestion from "../StatementChatSetQuestion";
import NewSetStatementSimple from "../../../set/NewStatementSimple";
import Modal from "../../../../../../components/modal/Modal";
import { useLanguage } from "../../../../../../../functions/hooks/useLanguages";
import "./ChatMessageCard.scss";

export interface NewQuestion {
    statement: Statement;
    isOption: boolean;
    showModal: boolean;
}

interface ChatMessageCardProps {
    parentStatement: Statement;
    statement: Statement;
    showImage: (statement: User | null) => void;
    index: number;
    previousStatement: Statement | undefined;
}

const ChatMessageCard: FC<ChatMessageCardProps> = ({
    parentStatement,
    statement,
    showImage,
    previousStatement,
}) => {
    // Hooks
    const { statementType } = statement;
    const statementColor = useStatementColor(statementType || "");
    const { t, dir } = useLanguage();

    // Redux store
    const userId = store.getState().user.user?.uid;
    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.parentId),
    );

    // Use States
    const [isEdit, setIsEdit] = useState(false);
    const [isNewStatementModalOpen, setIsNewStatementModalOpen] =
        useState(false);

    // Variables
    const creatorId = statement.creatorId;
    const _isAuthorized = isAuthorized(
        statement,
        statementSubscription,
        parentStatement.creatorId,
    );

    const isMe = userId === creatorId;
    const isQuestion = statementType === StatementType.question;
    const isOption = isOptionFn(statement);

    const shouldLinkToChildStatements =
        (isQuestion || isOption) && parentStatement.hasChildren;

    const isPreviousFromSameAuthor = previousStatement?.creatorId === creatorId;

    const isLTR = dir === "ltr";
    const isAlignedLeft = (isMe && dir === "ltr") || (!isMe && dir === "rtl");

    return (
        <div
            className={`chat-message-card ${isAlignedLeft && "aligned-left"} ${dir}`}
        >
            {!isPreviousFromSameAuthor && (
                <div className="user">
                    <ProfileImage statement={statement} showImage={showImage} />
                    <span>{statement.creator.displayName}</span>
                </div>
            )}

            <div
                className="message-box"
                style={{ borderColor: statementColor.backgroundColor }}
            >
                {!isPreviousFromSameAuthor && <div className="triangle" />}

                <div className="info">
                    <div className="info-text">
                        <EditTitle
                            statement={statement}
                            isEdit={isEdit}
                            setEdit={setIsEdit}
                            isTextArea={true}
                        />
                    </div>
                    <CardMenu isAlignedLeft={isLTR}>
                        <StatementChatSetEdit
                            isAuthorized={_isAuthorized}
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
                                setShowModal={setIsNewStatementModalOpen}
                                text={t("Add Question")}
                            />
                        )}
                        <StatementChatSetOption
                            parentStatement={parentStatement}
                            statement={statement}
                            text={t("Option")}
                        />
                    </CardMenu>
                </div>
                {shouldLinkToChildStatements && (
                    <StatementChatMore statement={statement} />
                )}

                {/* <div className="actions">
                    <div className="actions-type"></div>
                     <div className="evaluations">
                        <Evaluation
                            statement={statement}
                            displayScore={false}
                        />
                    </div> 
                </div>*/}
            </div>
            {isNewStatementModalOpen && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatement={statement}
                        isOption={false}
                        setShowModal={setIsNewStatementModalOpen}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ChatMessageCard;
