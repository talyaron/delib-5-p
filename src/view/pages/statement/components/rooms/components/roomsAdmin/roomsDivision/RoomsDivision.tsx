import { FC } from "react";
import styles from "../RoomsAdmin.module.scss";
import {
  divideParticipantIntoRoomsToDB,
  setParticipantsPerRoom,
  toggleRoomEditingInDB,
} from "@/controllers/db/rooms/setRooms";
import { ParticipantInRoom, RoomSettings, Statement } from "delib-npm";
import Button from "@/view/components/buttons/button/Button";
import { useLanguage } from "@/controllers/hooks/useLanguages";

interface Props {
  statement: Statement;
  roomSettings: RoomSettings | undefined;
  topics: Statement[];
  participants: ParticipantInRoom[];
}

const RoomsDivision: FC<Props> = ({
  statement,
  roomSettings,
  topics,
  participants,
}) => {
  const { t } = useLanguage();

  function handleToggleEdit() {
    toggleRoomEditingInDB(statement.statementId);

    divideParticipantIntoRoomsToDB(
      topics,
      participants,
      roomSettings?.participantsPerRoom || 7
    );
  }

  function handleSetParticipantsPerRoom(add: number) {
    setParticipantsPerRoom({ statementId: statement.statementId, add });
  }

  function handleSetParticipantsPerRoomNumber(number: number) {
    setParticipantsPerRoom({ statementId: statement.statementId, number });
  }
  return (
    <>
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
    </>
  );
};

export default RoomsDivision;
