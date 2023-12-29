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
    getPastelColor,
    isAuthorized,
    linkToChildren,
} from "../../../../../../functions/general/helpers";
import MoreIcon from "../../../../../../assets/icons/MoreIcon";

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
        if (!edit && linkToChildren(statement, parentStatement))
            navigate(`/statement/${statement.statementId}/chat`);
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
                borderLeft: `8px solid ${statement.color || getPastelColor()}`,
            }}
            ref={elementRef}
        >
            <div className="optionCard__info">
                <div className="optionCard__info__text">
                    {/* <SetEdit
                        isAuthrized={_isAuthrized}
                        edit={edit}
                        setEdit={setEdit}
                    /> */}
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
                    <MoreIcon />
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
                <StatementChatSetOption statement={statement} />
            </div>
        </div>
    );
};

export default StatementEvaluationCard;
