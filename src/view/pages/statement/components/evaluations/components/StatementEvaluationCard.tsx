import { FC, useEffect, useRef, useState } from "react";

// Third Party
import { Statement, User } from "delib-npm";

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
    isOptionFn,
    linkToChildren,
} from "../../../../../../functions/general/helpers";

// Hooks
import useStatementColor, {
    StyleProps,
} from "../../../../../../functions/hooks/useStatementColor";

// Custom Components
import EditIcon from "../../../../../../assets/icons/editIcon.svg?react";
import LightBulbIcon from "../../../../../../assets/icons/lightBulbIcon.svg?react";
import { setStatementisOption } from "../../../../../../functions/db/statements/setStatments";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";
import EditTitle from "../../../../../components/edit/EditTitle";
import Evaluation from "../../../../../components/evaluation/Evaluation";
import Menu from "../../../../../components/menu/Menu";
import MenuOption from "../../../../../components/menu/MenuOption";
import Modal from "../../../../../components/modal/Modal";
import StatementChatMore from "../../chat/components/StatementChatMore";
import AddQuestionIcon from "../../../../../../assets/icons/addQuestion.svg?react";
import NewSetStatementSimple from "../../set/NewStatementSimple";
import "./StatementEvaluationCard.scss";
import IconButton from "../../../../../components/iconButton/IconButton";

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
    const [shouldShowAddSubQuestionModal, setShouldShowAddSubQuestionModal] =
        useState(false);
    const [isCardMenuOpen, setIsCardMenuOpen] = useState(false);

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

    function handleSetOption() {
        try {
            if (statement.statementType === "option") {
                const cancelOption = window.confirm(
                    "Are you sure you want to cancel this option?",
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

    const shouldLinkToChildStatements = linkToChildren(
        statement,
        parentStatement,
    );

    return (
        <div
            className="statement-evaluation-card"
            style={{
                top: `${newTop}px`,
                borderLeft: `8px solid ${
                    statementColor.backgroundColor || "wheat"
                }`,
                color: statementColor.color,
            }}
            ref={elementRef}
        >
            <div className="info">
                <div className="text">
                    <EditTitle
                        statement={statement}
                        isEdit={edit}
                        setEdit={setEdit}
                        isTextArea={true}
                    />
                </div>
                <div className="more">
                    {_isAuthorized && (
                        <Menu
                            setIsOpen={setIsCardMenuOpen}
                            isMenuOpen={isCardMenuOpen}
                            iconColor="#5899E0"
                        >
                            <MenuOption
                                label={t("Edit Text")}
                                icon={<EditIcon />}
                                onOptionClick={() => {
                                    setEdit(!edit);
                                    setIsCardMenuOpen(false);
                                }}
                            />
                            <MenuOption
                                isOptionSelected={isOptionFn(statement)}
                                icon={<LightBulbIcon />}
                                label={t("Remove Option")}
                                onOptionClick={handleSetOption}
                            />
                        </Menu>
                    )}
                </div>
            </div>
            {shouldLinkToChildStatements && (
                <div className="chat">
                    <StatementChatMore
                        statement={statement}
                        color={statementColor.color}
                    />
                </div>
            )}
            <div className="actions">
                <Evaluation
                    parentStatement={parentStatement}
                    statement={statement}
                />
                {parentStatement.hasChildren && (
                    <IconButton
                        className="add-sub-question-button"
                        onClick={() => setShouldShowAddSubQuestionModal(true)}
                    >
                        <AddQuestionIcon />
                    </IconButton>
                )}
            </div>
            {shouldShowAddSubQuestionModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatement={statement}
                        isOption={false}
                        setShowModal={setShouldShowAddSubQuestionModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default StatementEvaluationCard;
