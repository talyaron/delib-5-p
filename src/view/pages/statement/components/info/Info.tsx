import { Statement } from "delib-npm";
import { FC } from "react";
import InfoParser from "../../../../components/InfoParser/InfoParser";
import styles from "./info.module.scss";
import Rectangle from "../../../../components/icons/InfoMap";

interface Props {
  statement: Statement;
}

const Info: FC<Props> = ({ statement }) => {
  //detect if local or production
  const isLocal = process.env.NODE_ENV === "development";

  const url = isLocal
    ? `http://localhost:5174/doc/${statement.statementId}`
    : `https://freedis.web.app/doc/${statement.statementId}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__header}>
        <InfoParser statement={statement} />
      </div>
      <div className={styles.wrapper__main}>
        <Rectangle />
        <p className={styles.wrapper__main__agreement}>Agreement</p>
        <p className={styles.wrapper__main__disinterest}>Disinterest</p>
        <p className={styles.wrapper__main__disputes}>Disputes</p>
        <p className={styles.wrapper__main__taboo}>Boo</p>
      </div>
      {/* <div className="wrapper">
				<InfoParser statement={statement} />
				<a href={url} target="_blank">To Document</a>
			</div> */}
    </div>
  );
};

export default Info;
