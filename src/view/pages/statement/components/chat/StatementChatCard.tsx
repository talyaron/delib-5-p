import { FC, useEffect, useState } from "react";

// Third Party Imports
import { Statement, StatementType } from "delib-npm";
import { t } from "i18next";

// Custom Components
import StatementChatMore from "./StatementChatMore";
import ProfileImage from "./components/ProfileImage";
import EditTitle from "../../../../components/edit/EditTitle";
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

import useStatementColor from "../../../../../functions/hooks/useStatementColor";

import CardMenu from "../../../../components/cardMenu/CardMenu";
import MoreIcon from "../../../../../assets/icons/MoreIcon";
import StatementChatSetOption from "./components/StatementChatSetOption";
import StatementChatSetQuestion from "./components/StatementChatSetQuestion";
import NewSetStatementSimple from "../set/NewStatementSimple";
import Modal from "../../../../components/modal/Modal";

export interface NewQuestion {
    statement: Statement;
    isOption: boolean;
    showModal: boolean;
}

interface Props {
    parentStatement: Statement;
    statement: Statement;
    showImage: Function;
    setShowModal?: Function;
    index: number;
    previousStatement: Statement | undefined;
}

const StatementChat: FC<Props> = ({
    parentStatement,
    statement,
    showImage,
    previousStatement,
}) => {
    const { statementType } = statement;

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.parentId)
    );
    const userId = store.getState().user.user?.uid;

    const statementColor = useStatementColor(statement);

    const creatorId = statement.creatorId;
    const _isAuthrized = isAuthorized(
        statement,
        statementSubscription,
        parentStatement.creatorId
    );

    const isMe = userId === creatorId;
    const isQuestion = statementType === StatementType.question;
    const isOption = isOptionFn(statement);

    const displayChat = isQuestion || isOption;

    const [isEdit, setIsEdit] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const displayUserName = !previousStatement
        ? true
        : previousStatement.creatorId !== statement.creatorId
        ? true
        : false;

    // function handleSetQuestion() {
    //     updateIsQuestion(statement);
    // }

    // function handleSetOption() {
    //     try {
    //         if (statement.statementType === "option") {
    //             const cancelOption = window.confirm(
    //                 "Are you sure you want to cancel this option?"
    //             );
    //             if (cancelOption) {
    //                 setStatementisOption(statement);
    //             }
    //         } else {
    //             setStatementisOption(statement);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // const optionIcon = (
    //     <div className="clickable">
    //         {isOptionFn(statement) ? (
    //             <LightBulbIcon color="gold" />
    //         ) : (
    //             <LightBulbIcon color="lightgray" />
    //         )}
    //     </div>
    // );

 
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
                style={{
                    borderRight: isMe
                        ? `.65rem solid ${statementColor.backgroundColor}`
                        : undefined,
                    borderLeft: isMe
                        ? undefined
                        : `.65rem solid ${statementColor.backgroundColor}`,
                }}
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
                    <div onClick={() => setOpenMenu(true)}>
                        <MoreIcon />
                    </div>
                    {openMenu && (
                        <div
                            onClick={() => {
                                setOpenMenu(false);
                            }}
                        >
                            <CardMenu setOpenMenu={setOpenMenu}>
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
                                <AddSubQuestion
                                    statement={statement}
                                    setShowModal={setShowModal}
                                    text={t("Add Question")}
                                />
                                <StatementChatSetOption
                                    parentStatement={parentStatement}
                                    statement={statement}
                                    text={t("Option")}
                                />
                            </CardMenu>
                        </div>
                    )}
                    <div className="message__box__info__text">
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
                        isOption={true}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default StatementChat;
