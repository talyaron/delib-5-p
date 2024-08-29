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
  console.log(subStatements);

  return (
    <>
      <div className={styles.triangle}></div>
      <div className={`${styles.triangle} ${styles["triangle--invisible"]}`}>
        {subStatements.map((subStatement) => {
          return (
            <Dot key={subStatement.statementId} subStatement={subStatement} />
          );
        })}
      </div>
    </>
  );
};

export default Triangle;
