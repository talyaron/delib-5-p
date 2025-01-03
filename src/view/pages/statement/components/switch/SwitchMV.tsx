import { getStatementFromDB } from "@/controllers/db/statements/getStatement";
import { setStatement, statementSelectorById } from "@/model/statements/statementsSlice";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { StatementContext } from "../../StatementCont";
import { StatementType } from "delib-npm";

export function useSwitchMV() {
	const dispatch = useDispatch();
	//get parent statement
	const { statementId } = useParams();
	const { statement } = useContext(StatementContext);
	const parentStatement = useSelector(statementSelectorById(statement?.parentId));

	useEffect(() => {
		if (!parentStatement && statementId && statement?.statementType === StatementType.stage) {

			getStatementFromDB(statement?.parentId).then((statement) => {
				if (statement) {
					dispatch(setStatement(statement));
				}
			});
		};
	}, [parentStatement?.statementId, statement?.statementId, statementId]);

	return { parentStatement };
}