import { FC, useEffect, useState, useRef } from "react";
import { Statement, StatementType } from "delib-npm";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../../functions/hooks/reduxHooks";
// import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import {
    setStatementElementHight,
    statementSubscriptionSelector,
} from "../../../../../../model/statements/statementsSlice";

import StatementChatSetOption from "../../chat/components/StatementChatSetOption";

//images

import EditTitle from "../../../../../components/edit/EditTitle";
import Evaluation from "../../../../../components/evaluation/Evaluation";
import StatementChatSetEdit from "../../chat/components/StatementChatSetEdit";
import { isAuthorized } from "../../../../../../functions/general/helpers";
import StatementChatMore from "../../chat/StatementChatMore";
import AddSubQuestion from "../../chat/components/addSubQuestion/AddSubQuestion";
import { useNavigate } from "react-router";

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
    const { hasChildren } = parentStatement;

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
        if (!edit) navigate(`/statement/${statement.statementId}/chat`);
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
                    <StatementChatSetEdit
                        isAuthrized={_isAuthrized}
                        edit={edit}
                        setEdit={setEdit}
                    />
                    <div className="clickable" onClick={handleGoToOption}>
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
            {hasChildren ? (
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
