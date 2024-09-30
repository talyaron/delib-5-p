import React, { FC } from "react";
import PointDown from "@/assets/images/handPointingDown.png";
import styles from "./StartHere.module.scss";
interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}
const StartHere:FC<Props> = ({setShow}) => {
  return (
    <div onClick={()=>setShow(false)} className={styles.wrapper}>
        <div className={styles.text}>Add new option here</div>
      <img className={styles.img} src={PointDown} alt="start here pointer" />
    </div>
  );
};

export default StartHere;
