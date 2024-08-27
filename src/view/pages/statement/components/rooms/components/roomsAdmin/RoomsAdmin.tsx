import { Statement } from "delib-npm";
import { FC } from "react";

import { useLanguage } from "@/controllers/hooks/useLanguages";
import styles from "./RoomsAdmin.module.scss";
import Button from "@/view/components/buttons/button/Button";
import {
  setNewRoomSettingsToDB,
  setParticipantsPerRoom,
  toggleRoomEditingInDB,
} from "@/controllers/db/rooms/setRooms";
import { roomSettingsByStatementId } from "@/model/rooms/roomsSlice";
import { useSelector } from "react-redux";

interface Props {
  statement: Statement;
}

const RoomsAdmin: FC<Props> = ({ statement }) => {
  const { t } = useLanguage();

  const roomSettings = useSelector(
    roomSettingsByStatementId(statement.statementId)
  );
  console.log(roomSettings)
  if (!roomSettings) {
    setNewRoomSettingsToDB(statement.statementId);
  }

  function handleToggleEdit() {
    toggleRoomEditingInDB(statement.statementId);
  }

  function handleSetParticipantsPerRoom(add: number) {
    setParticipantsPerRoom({statementId:statement.statementId, add});
  }

  function handleSetParticipantsPerRoomNumber(number: number) {
	setParticipantsPerRoom({statementId:statement.statementId, number});
  }

  return (
    <div className="rooms-admin">
      <p className="title">{t("Management board")}</p>

      <Button text={t("Set Into Rooms")} onClick={handleToggleEdit} />
      <div className={styles.participantsPerRoom}>
        <div
          className={styles.add}
          onClick={() => handleSetParticipantsPerRoom(1)}
        >
          +
        </div>
        <input
          type="number"
          value={roomSettings?.participantsPerRoom || 7}
		  onChange={(e)=>handleSetParticipantsPerRoomNumber(e.target.valueAsNumber)}
        />
        <div
          className={styles.add}
          onClick={() => handleSetParticipantsPerRoom(-1)}
        >
          -
        </div>
      </div>
    </div>
  );
};

export default RoomsAdmin;
