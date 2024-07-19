import { StatementSubscription } from "delib-npm";
import { FC, useEffect } from "react";
import {
	useAppDispatch,
	useAppSelector,
} from "../../../../../../controllers/hooks/reduxHooks";
import {
	setStatement,
	statementSelectorById,
} from "../../../../../../model/statements/statementsSlice";
import { getStatementFromDB } from "../../../../../../controllers/db/statements/getStatement";
import { Link } from "react-router-dom";
import { getTitle } from "../../../../../components/InfoParser/InfoParserCont";
import { getTime, truncateString } from "../../../../../../controllers/general/helpers";


interface Props {
  subscription: StatementSubscription;
}

const UpdateMainCard: FC<Props> = ({ subscription }) => {
	const dispatch = useAppDispatch();
	const parentStatement = useAppSelector(
		statementSelectorById(subscription.statement.parentId)
	);

	useEffect(() => {
		if (!parentStatement) {
			getStatementFromDB(subscription.statement.parentId).then((st) => {
				if (st) dispatch(setStatement(st));
			});
		}
	}, [parentStatement]);

	

	const group = parentStatement?getTitle(parentStatement.statement):"";
	const text = getTitle(subscription.statement.statement);

	return (
		<Link to={`/statement/${subscription.statement.parentId}/chat`}>
			<p>
				{parentStatement ? <span>{truncateString(group)}: </span> : null}
				<span>{truncateString(text,32)} </span>
                <span className="time">{getTime(subscription.lastUpdate)}</span>
			</p>
		</Link>
	);
};

export default UpdateMainCard;
