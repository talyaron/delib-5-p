import { FC, useEffect, useState, useRef } from "react";

// Third Party
import { Statement, StatementType, User } from "delib-npm";
import { useNavigate } from "react-router";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../../functions/hooks/reduxHooks";
import {
    setStatementElementHight,
    statementSubscriptionSelector,
} from "../../../../../../model/statements/statementsSlice";

// Helpers
import {
    isAuthorized,
    linkToChildren,
} from "../../../../../../functions/general/helpers";
import CardMenu from "../../../../../components/cardMenu/CardMenu";

// Hooks
import useStatementColor, {
    StyleProps,
} from "../../../../../../functions/hooks/useStatementColor";
import useDirection from "../../../../../../functions/hooks/useDirection";

// Custom Components
import StatementChatSetOption from "../../chat/components/StatementChatSetOption";
import EditTitle from "../../../../../components/edit/EditTitle";
import Evaluation from "../../../../../components/evaluation/Evaluation";
import AddSubQuestion from "../../chat/components/addSubQuestion/AddSubQuestion";
import StatementChatMore from "../../chat/components/StatementChatMore";
import SetEdit from "../../../../../components/edit/SetEdit";
import Modal from "../../../../../components/modal/Modal";
import NewSetStatementSimple from "../../set/NewStatementSimple";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";

interface Props {
    statement: Statement;
    parentStatement: Statement;
    showImage: (talker: User | null) => void;
    top: number;
}

const StatementEvaluationCard: FC<Props> = ({
    parentStatement,
    statement,
    top,
}) => {
    // Hooks
    const navigate = useNavigate();
    const direction = useDirection();
    const { t } = useLanguage();

    // Redux Store
    const dispatch = useAppDispatch();
    const statementColor: StyleProps = useStatementColor(
        statement.statementType || "",
    );
    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.statementId),
    );

    // Use Refs
    const elementRef = useRef<HTMLDivElement>(null);

    // Use States
    const [newTop, setNewTop] = useState(top);
    const [edit, setEdit] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Vriables
    const isRtl = direction === "row-reverse";

    const _isAuthorized = isAuthorized(
        statement,
        statementSubscription,
        parentStatement.creatorId,
    );

    useEffect(() => {
        setNewTop(top);
    }, [top]);

    useEffect(() => {
        dispatch(
            setStatementElementHight({
                statementId: statement.statementId,
                height: elementRef.current?.clientHeight,
            }),
        );
    }, []);

    // function handleGoToOption() {
    //     if (!edit && linkToChildren(statement, parentStatement))
    //         navigate(`/statement/${statement.statementId}/options`);
    // }

    return (
        <div
            className={
                statement.statementType === StatementType.result
                    ? "optionCard optionCard--result"
                    : "optionCard"
            }
            style={{
                top: `${newTop}px`,
                borderLeft: `8px solid ${
                    statementColor.backgroundColor || "wheat"
                }`,
                color: statementColor.color,
            }}
            ref={elementRef}
        >
            <div className="optionCard__info">
                <div className="optionCard__info__text">
                    <div>
                        <EditTitle
                            statement={statement}
                            isEdit={edit}
                            setEdit={setEdit}
                            isTextArea={true}
                        />
                    </div>
                </div>
                <div className="optionCard__info__more">
                    {_isAuthorized && (
                        <CardMenu isMe={isRtl}>
                            <span onClick={() => setEdit(true)}>
                                {t("Edit Text")}
                            </span>
                            <SetEdit
                                isAuthrized={isAuthorized(
                                    statement,
                                    statementSubscription,
                                    parentStatement.creatorId,
                                )}
                                edit={edit}
                                setEdit={setEdit}
                            />

                            <StatementChatSetOption
                                parentStatement={parentStatement}
                                statement={statement}
                                text={t("Remove Option")}
                            />
                        </CardMenu>
                    )}
                </div>
            </div>
            {linkToChildren(statement, parentStatement) && (
                <div className="optionCard__info__chat">
                    <StatementChatMore
                        statement={statement}
                        color={statementColor.color}
                    />
                </div>
            )}
            <div className="optionCard__actions">
                <Evaluation statement={statement} />
                {parentStatement.hasChildren && (
                    <AddSubQuestion
                        statement={statement}
                        setShowModal={setShowModal}
                    />
                )}
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

export default StatementEvaluationCard;
