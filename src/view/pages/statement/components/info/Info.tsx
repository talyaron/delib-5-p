import { Statement } from "delib-npm";
import { FC } from "react";
import InfoParser from "../../../../components/InfoParser/InfoParser";
import styles from "./Info.module.scss";

interface Props {
  statement: Statement;
}

const Info: FC<Props> = ({ statement }) => {
  return (
    <div className={`wrapper ${styles.wrapper}`}>
      <InfoParser statement={statement} />
    </div>
  );
};

export default Info;
