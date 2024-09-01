import { FC } from "react";
import styles from "./Triangle.module.scss";
import { Statement } from "delib-npm";
import { useSelector } from "react-redux";
import { statementOptionsSelector } from "@/model/statements/statementsSlice";
import Dot from "./dot/Dot";

interface Props {
  statement: Statement;
}

const Triangle: FC<Props> = ({ statement }) => {
	const subStatements = useSelector(
		statementOptionsSelector(statement.statementId)
	).filter((s) => s.evaluation?.sumCon !== undefined);

	let maxEvaluators = 0;
	subStatements.forEach((subStatement) => {
		if (subStatement.evaluation?.numberOfEvaluators !== undefined &&  subStatement.evaluation?.numberOfEvaluators > maxEvaluators) maxEvaluators = subStatement.evaluation.numberOfEvaluators;
	});

	return (
		<>
			<div className={styles.triangle}></div>
			<div className={`${styles.triangle} ${styles["triangle--invisible"]}`}>
				{subStatements.map((subStatement) => {
					return (
						<Dot key={subStatement.statementId} subStatement={subStatement} maxEvaluators={maxEvaluators}/>
					);
				})}
			</div>
		</>
	);
};

export default Triangle;
