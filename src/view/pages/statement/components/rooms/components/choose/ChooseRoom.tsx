import { FC, useState } from "react";

// Third party
import { Statement } from "delib-npm";

// Custom components
import RoomChoosingCard from "./roomChoosingCard/RoomChoosingCard";
import { useLanguage } from "@/controllers/hooks/useLanguages";

import styles from "./ChooseRoom.module.scss";
import Button from "@/view/components/buttons/button/Button";

import CreateStatementModal from "../../../createStatementModal/CreateStatementModal";


interface Props {
  statement: Statement;
  topics: Statement[];
}

const ChooseRoom: FC<Props> = ({ statement, topics }) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <h2>{t("Division into rooms")}</h2>
      <div className="btns">
        <Button text={t("Create new room")} onClick={() => handleAddRoom()} />
      </div>
      <div className="roomsCards__wrapper">
        {topics.map((topic: Statement) => {
          return <RoomChoosingCard key={topic.statementId} topic={topic} />;
        })}
       
      </div>
      {showModal && (
        <CreateStatementModal
          parentStatement={statement}
          isOption={true}
          setShowModal={setShowModal}
        />
      )}
    </>
  );

  function handleAddRoom() {
    setShowModal(true);
  }
};

export default ChooseRoom;
