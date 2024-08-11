import { Statement } from "delib-npm";
import { FC } from "react";

interface Props {
    statement: Statement;
}
const ResultsComp: FC<Props> = ({ statement }) => {
	return <div>{statement.statement} results</div>;
};

export default ResultsComp;
