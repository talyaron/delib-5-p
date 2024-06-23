import { FC } from "react";

// Third party
import { Statement } from "delib-npm";

// Custom components
import RoomChoosingCard from "./roomChoosingCard/RoomChoosingCard";
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";

import styles from "./ChooseRoom.module.scss";

interface Props {
  subStatements: Statement[];
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseRoom: FC<Props> = ({ subStatements, setShowModal }) => {
  const { t } = useLanguage();

  return (
    <>
      <h2>{t("Division into rooms")}</h2>
      <div className="roomsCards__wrapper">
        {subStatements.map((subStatement: Statement) => {
          return (
            <RoomChoosingCard
              key={subStatement.statementId}
              statement={subStatement}
            />
          );
        })}
        <div
          className={styles.fav}
          style={{ height: "3rem" }}
          onClick={() => setShowModal(true)}
        >
          +
        </div>
      </div>
	  
    </>
  );
};

export default ChooseRoom;
