import { FC } from "react";

// // Third Party Libraries
import {  Statement } from "delib-npm";

// Redux


// Styles
import styles from  "./InRoom.module.scss";


// Custom Components


interface Props {
  topic: Statement;
}

const InRoom: FC<Props> = ({ topic }) => {
  try {
    return <div className={styles.inRoom}>
      <h1>In Room</h1>
    </div>;
  
  } catch (error: any) {
    return null;
  }
};

export default InRoom;
