import { Statement } from "delib-npm";
import { FC, useState, useRef } from "react";
import styles from "./Dot.module.scss";

interface Props {
  subStatement: Statement;
}

const Dot: FC<Props> = ({ subStatement }) => {
  const randomX = useRef<number>((Math.random() - 0.5) * 2);
  const randomY = useRef<number>((Math.random() - 0.5) * 2);
  const [show, setShow] = useState(false);
  const { sumCon, sumPro, numberOfEvaluators } = subStatement.evaluation!;
  if (sumCon === undefined || sumPro === undefined) return null;


  function handleShowTooltip(isShow: boolean) {
    setShow(isShow);
  }
  return (
    <div
      key={subStatement.statementId}
      className={styles.dot}
      style={{
        bottom: `calc(${(sumCon / numberOfEvaluators) * 85}% + ${randomX.current}rem + .1rem)`,
        left: `calc(${(sumPro / numberOfEvaluators) * 85}% + ${randomY.current}rem + .1rem)`,
      }}
      onMouseEnter={() => handleShowTooltip(true)}
      onMouseLeave={() => handleShowTooltip(false)}
    >
      {show && (
        <div className={styles.tooltip}>
          <div>{subStatement.statement}</div>
          <div>Support: {sumPro}</div>
          <div>Against: {sumCon}</div>
          <div>{numberOfEvaluators} evaluators</div>
        </div>
      )}
    </div>
  );
};

export default Dot;
