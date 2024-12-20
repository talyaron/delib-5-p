import React, { FC } from "react";
import styles from "./StartHere.module.scss";
import PointDown from "@/assets/images/handPointingDown.png";
import { decreesUserSettingsLearningRemain } from "@/controllers/db/learning/setLearning";
import { useLanguage } from "@/controllers/hooks/useLanguages";

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const StartHere: FC<Props> = ({ setShow }) => {
	const {t} = useLanguage();
	function handleCloseModal() {
		setShow(false);
		decreesUserSettingsLearningRemain({ addOption: true });
	}
	
	return (
		<button onClick={handleCloseModal} className={styles.wrapper}>
			<div className={styles.text}>{t("Add new option here")}</div>
			<img className={styles.img} src={PointDown} alt="start here pointer" />
		</button>
	);
};

export default StartHere;
