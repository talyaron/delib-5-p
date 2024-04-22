import { FC, useEffect, useRef, useState } from "react";

// Third Party
import { Statement, StatementType, User } from "delib-npm";

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
import AddSubQuestion from "../../chat/components/addSubQuestion/AddSubQuestion";
import NewSetStatementSimple from "../../set/NewStatementSimple";

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
    const [showModal, setShowModal] = useState(false);
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
                        <Menu
                            setIsOpen={setIsCardMenuOpen}
                            isMenuOpen={isCardMenuOpen}
                            iconColor="#5899E0"
                        >
                            <MenuOption
                                label={t("Edit Text")}
                                icon={<EditIcon style={{ color: "#226cbc" }} />}
                                onOptionClick={() => {
                                    setEdit(!edit);
                                    setIsCardMenuOpen(false);
                                }}
                            />
                            <MenuOption
                                isOptionSelected={isOptionFn(statement)}
                                icon={
                                    <LightBulbIcon
                                        style={{ color: "#226cbc" }}
                                    />
                                }
                                label={t("Remove Option")}
                                onOptionClick={handleSetOption}
                            />
                        </Menu>
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
                <Evaluation
                    parentStatement={parentStatement}
                    statement={statement}
                />
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
