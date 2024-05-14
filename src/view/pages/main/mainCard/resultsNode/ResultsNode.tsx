import { Statement, StatementType } from "delib-npm";
import { FC } from "react";
import Text from "../../../../components/text/Text";
import StatementChatMore from "../../../statement/components/chat/components/StatementChatMore";
import { Link } from "react-router-dom";
import "./ResultsNode.scss";
import { styleSwitch } from "./ResultsNodeCont";

interface Props {
    statement: Statement;
    resultsType: StatementType[];
}
export const ResultsNode: FC<Props> = ({ statement }) => {
	return (
		<div className={styleSwitch(statement)}>
			<Link
				state={{
					from: window.location.pathname,
				}}
				to={`/statement/${statement.statementId}/chat`}
			>
				<Text text={statement.statement} />

				<StatementChatMore statement={statement} />
			</Link>
		</div>
	);
};
