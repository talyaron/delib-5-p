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
import SetEdit from "../../../../../components/edit/SetEdit";
import AddSubQuestion from "../../chat/components/addSubQuestion/AddSubQuestion";
import StatementChatMore from "../../chat/StatementChatMore";

// Helpers
import {
    isAuthorized,
    linkToChildren,
} from "../../../../../../functions/general/helpers";

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

    const _isAuthrized = isAuthorized(statement, statementSubscription);
    const elementRef = useRef<HTMLDivElement>(null);
    // const { hasChildren } = parentStatement;

    const [newTop, setNewTop] = useState(top);
    const [edit, setEdit] = useState(false);

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
        if (!edit && linkToChildren(statement, parentStatement)) navigate(`/statement/${statement.statementId}/chat`);
    }

    return (
        <div
            className={
                statement.statementType === StatementType.result
                    ? "options__card options__card--result"
                    : "options__card"
            }
            style={{ top: `${newTop}px` }}
            ref={elementRef}
        >
            <div className="options__card__main">
                <div className="options__card__text text">
                    <SetEdit
                        isAuthrized={_isAuthrized}
                        edit={edit}
                        setEdit={setEdit}
                    />
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
                </div>

                <Evaluation statement={statement} />
            </div>
            {linkToChildren(statement, parentStatement) ? (
                <>
                    <AddSubQuestion statement={statement} />
                    <div className="options__card__chat">
                        <StatementChatMore statement={statement} />
                        <div className="options__card__chat__settings">
                            <StatementChatSetOption statement={statement} />
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default StatementEvaluationCard;
