import { FC, useEffect, useRef, useState } from "react";

// Third Party
import { Statement, User, isOptionFn } from "delib-npm";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../../controllers/hooks/reduxHooks";
import {
    setStatementElementHight,
    statementSubscriptionSelector,
} from "../../../../../../model/statements/statementsSlice";

// Helpers
import {
    isAuthorized,
    linkToChildren,
} from "../../../../../../controllers/general/helpers";

// Hooks
import useStatementColor, {
    StyleProps,
} from "../../../../../../controllers/hooks/useStatementColor";

// Custom Components
import EditIcon from "../../../../../../assets/icons/editIcon.svg?react";
import LightBulbIcon from "../../../../../../assets/icons/lightBulbIcon.svg?react";
import { setStatementIsOption } from "../../../../../../controllers/db/statements/setStatements";
import { useLanguage } from "../../../../../../controllers/hooks/useLanguages";
import EditTitle from "../../../../../components/edit/EditTitle";
import Menu from "../../../../../components/menu/Menu";
import MenuOption from "../../../../../components/menu/MenuOption";
import IconButton from "../../../../../components/iconButton/IconButton";
import StatementChatMore from "../../chat/components/StatementChatMore";
import AddQuestionIcon from "../../../../../../assets/icons/addQuestion.svg?react";
import CreateStatementModal from "../../createStatementModal/CreateStatementModal";
import Evaluation from "./evaluation/Evaluation";
import "./StatementEvaluationCard.scss";

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

    const { t, dir } = useLanguage();

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
    const [isEdit, setIsEdit] = useState(false);
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
    //     if (!isEdit && linkToChildren(statement, parentStatement))
    //         navigate(`/statement/${statement.statementId}/options`);
    // }

    function handleSetOption() {
        try {
            if (statement.statementType === "option") {
                const cancelOption = window.confirm(
                    "Are you sure you want to cancel this option?",
                );
                if (cancelOption) {
                    setStatementIsOption(statement);
                }
            } else {
                setStatementIsOption(statement);
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
                flexDirection: dir === "ltr" ? "row" : "row-reverse",
            }}
            ref={elementRef}
        >
            <div
                className="selected-option"
                style={{
                    backgroundColor: statement.selected
                        ? statementColor.backgroundColor
                        : "",
                }}
            >
                <div
                    style={{
                        color: statementColor.color,
                        display: statement.selected ? "block" : "none",
                    }}
                >
                    {t("Selected")}
                </div>
            </div>
            <div className="main">
                <div className="info">
                    <div className="text">
                        <EditTitle
                            statement={statement}
                            isEdit={isEdit}
                            setEdit={setIsEdit}
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
                                {_isAuthorized && (
                                    <MenuOption
                                        label={t("Edit Text")}
                                        icon={<EditIcon />}
                                        onOptionClick={() => {
                                            setIsEdit(!isEdit);
                                            setIsCardMenuOpen(false);
                                        }}
                                    />
                                )}
                                {_isAuthorized && (
                                    <MenuOption
                                        isOptionSelected={isOptionFn(statement)}
                                        icon={<LightBulbIcon />}
                                        label={
                                            isOptionFn(statement)
                                                ? t("Unmark as a Solution")
                                                : t("Mark as a Solution")
                                        }
                                        onOptionClick={handleSetOption}
                                    />
                                )}
                            </Menu>
                        )}
                    </div>
                </div>
                {shouldLinkToChildStatements && (
                    <div className="chat">
                        <StatementChatMore statement={statement} />
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
                            onClick={() =>
                                setShouldShowAddSubQuestionModal(true)
                            }
                        >
                            <AddQuestionIcon />
                        </IconButton>
                    )}
                </div>
                {shouldShowAddSubQuestionModal && (
                    <CreateStatementModal
                        parentStatement={statement}
                        isOption={false}
                        setShowModal={setShouldShowAddSubQuestionModal}
                    />
                )}
            </div>
        </div>
    );
};

export default StatementEvaluationCard;
