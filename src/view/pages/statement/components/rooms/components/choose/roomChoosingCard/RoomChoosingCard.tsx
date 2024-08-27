import { Statement } from "delib-npm";
import { FC } from "react";
import styles from "./RoomChoosingCard.module.scss";
import { useSelector } from "react-redux";
import { participantsByTopicId } from "@/model/rooms/roomsSlice";
import { userSelector } from "@/model/users/userSlice";
import {
  deleteParticipantToDB,
  setParticipantToDB,
} from "@/controllers/db/rooms/setRooms";

interface Props {
  topic: Statement;
}
const RoomChoosingCard: FC<Props> = ({ topic }) => {
  const user = useSelector(userSelector);
  const participants = useSelector(participantsByTopicId(topic.statementId));
  const participant = participants.find((prt) => prt.user.uid === user?.uid);

  function handleJoinRoom() {
    if (participant) {
      console.log('deleteParticipantToDB')
      deleteParticipantToDB(topic);
    } else {
      console.log('setParticipantToDB')
      setParticipantToDB(topic);
    }
  }

  return (
    <div className={`${styles.roomCard} ${participant && styles["roomCard--selected"]}`} onClick={handleJoinRoom}>
      <div className={styles.title}>{topic.statement}</div>
      <div className={styles.amount}>{participants.length}</div>
    </div>
  );
};

export default RoomChoosingCard;
