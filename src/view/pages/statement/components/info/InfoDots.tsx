import { Statement } from "delib-npm";
import styles from "./info.module.scss";

type Props = {
  statement: Statement;
};

const InfoDots = ({ statement }: Props) => {
  const evaliuation = statement.evaluation;
  // const evaliuationId = statement.evaluation

  // const diagonal = Math.sqrt(Math.pow(282, 2) + Math.pow(463 / 2, 2));
  const avg = (213 + 350 / 2) / 2;
  const total = evaliuation?.numberOfEvaluators;
  const xAxis = (evaliuation?.sumPro! * avg) / total!;
  const yAxis = (evaliuation?.sumCon! * avg) / total!;
  const color = `rgb(${(evaliuation?.sumCon! / total!) * 255},${(evaliuation?.sumPro! / total!) * 255},0)`;
  return (
    <div
      className={styles.infoDots}
      // style={{ top: xAxis, left: yAxis, backgroundColor: color }}
      style={{
        top: (yAxis - xAxis) * 0.96 + 196,
        left: yAxis + xAxis,
        background: color,
      }}
    ></div>
  );
};

export default InfoDots;
