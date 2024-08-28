import { Statement } from "delib-npm";
import { FC } from "react";

import { useLanguage } from "@/controllers/hooks/useLanguages";
import styles from "./RoomsAdmin.module.scss";
import Button from "@/view/components/buttons/button/Button";
import {
  clearRoomsToDB,
  divideParticipantIntoRoomsToDB,
  setNewRoomSettingsToDB,
  setParticipantsPerRoom,
  toggleRoomEditingInDB,
} from "@/controllers/db/rooms/setRooms";
import {
  participantsByStatementId,
  roomSettingsByStatementId,
} from "@/model/rooms/roomsSlice";
import { useSelector } from "react-redux";
import { statementSubsSelector } from "@/model/statements/statementsSlice";

interface Props {
  statement: Statement;
}

const RoomsAdmin: FC<Props> = ({ statement }) => {
  const participants = useSelector(
    participantsByStatementId(statement.statementId)
  );

  const topics = useSelector(statementSubsSelector(statement.statementId));

  const { t } = useLanguage();

  const roomSettings = useSelector(
    roomSettingsByStatementId(statement.statementId)
  );

  if (!roomSettings) {
    setNewRoomSettingsToDB(statement.statementId);
  }

  const isEditingRoom =
    roomSettings?.isEdit !== undefined ? roomSettings?.isEdit : true;

  function handleToggleEdit() {
    toggleRoomEditingInDB(statement.statementId);
    if (isEditingRoom) {
      divideParticipantIntoRoomsToDB(
        topics,
        participants,
        roomSettings?.participantsPerRoom || 7
      );
    } else {
      clearRoomsToDB(participants);
    }
  }

  function handleSetParticipantsPerRoom(add: number) {
    setParticipantsPerRoom({ statementId: statement.statementId, add });
  }

  function handleSetParticipantsPerRoomNumber(number: number) {
    setParticipantsPerRoom({ statementId: statement.statementId, number });
  }

  return (
    <div className="rooms-admin">
      <p className="title">{t("Management board")}</p>
      <div className={`btns ${styles.btns}`}>
        <Button
          text={t("Divide participants into rooms")}
          onClick={handleToggleEdit}
        />
      </div>
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
          onChange={(e) =>
            handleSetParticipantsPerRoomNumber(e.target.valueAsNumber)
          }
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
