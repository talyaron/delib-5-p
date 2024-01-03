import { FC, useEffect, useState, useRef } from "react";

// Third Party
import { Statement, StatementType } from "delib-npm";
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

// Custom Components
import StatementChatSetOption from "../../chat/components/StatementChatSetOption";
import EditTitle from "../../../../../components/edit/EditTitle";
import Evaluation from "../../../../../components/evaluation/Evaluation";
import AddSubQuestion from "../../chat/components/addSubQuestion/AddSubQuestion";
import StatementChatMore from "../../chat/StatementChatMore";
import SetEdit from "../../../../../components/edit/SetEdit";

// Helpers
import {
    getPastelColor,
    isAuthorized,
    linkToChildren,
} from "../../../../../../functions/general/helpers";
import MoreIcon from "../../../../../../assets/icons/MoreIcon";
import CardMenu from "../../../../../components/cardMenu/CardMenu";
import { t } from "i18next";

interface Props {
    statement: Statement;
    parentStatement: Statement;
    showImage: Function;
    top: number;
}

const StatementEvaluationCard: FC<Props> = ({
    parentStatement,
    statement,
    top,
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.statementId)
    );

    const elementRef = useRef<HTMLDivElement>(null);
    // const { hasChildren } = parentStatement;

    const [newTop, setNewTop] = useState(top);
    const [edit, setEdit] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        setNewTop(top);
    }, [top]);

    useEffect(() => {
        dispatch(
            setStatementElementHight({
                statementId: statement.statementId,
                height: elementRef.current?.clientHeight,
            })
        );
    }, []);

    function handleGoToOption() {
        if (!edit && linkToChildren(statement, parentStatement))
            navigate(`/statement/${statement.statementId}/chat`);
    }

    const _isAuthorized = isAuthorized(
        statement,
        statementSubscription,
        parentStatement.creatorId
    );

    return (
        <div
            className={
                statement.statementType === StatementType.result
                    ? "optionCard optionCard--result"
                    : "optionCard"
            }
            style={{
                top: `${newTop}px`,
                borderLeft: `8px solid ${statement.color || getPastelColor()}`,
            }}
            ref={elementRef}
        >
            <div className="optionCard__info">
                <div className="optionCard__info__text">
                    <div
                        className={
                            linkToChildren(statement, parentStatement)
                                ? "clickable"
                                : ""
                        }
                        onClick={handleGoToOption}
                    >
                        <EditTitle
                            statement={statement}
                            isEdit={edit}
                            setEdit={setEdit}
                            isTextArea={true}
                        />
                    </div>
                    <div
                        className="clickable"
                        onClick={() => {
                            setOpenMenu(!openMenu);
                        }}
                    >
                        {_isAuthorized && (
                            <>
                                <MoreIcon />
                                {openMenu && (
                                    <CardMenu setOpenMenu={setOpenMenu}>
                                        <span onClick={() => setEdit(true)}>
                                            {t("Edit Text")}
                                        </span>
                                        <SetEdit
                                            isAuthrized={isAuthorized(
                                                statement,
                                                statementSubscription
                                            )}
                                            edit={edit}
                                            setEdit={setEdit}
                                        />
                                        
                                         <StatementChatSetOption statement={statement} text={t("Remove Option")} />
                                    </CardMenu>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {linkToChildren(statement, parentStatement) && (
                    <div className="optionCard__info__chat">
                        <StatementChatMore statement={statement} />
                    </div>
                )}
            </div>
            <div className="optionCard__actions">
                <Evaluation statement={statement} />
                <AddSubQuestion statement={statement} />
               
            </div>
        </div>
    );
};

export default StatementEvaluationCard;
