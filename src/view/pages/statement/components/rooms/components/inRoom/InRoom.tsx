import { FC } from "react";

// // Third Party Libraries
import { Statement } from "delib-npm";

// Redux

// Styles
import styles from "./InRoom.module.scss";
import {
  participantByIdSelector,
  participantsByStatementId,
} from "@/model/rooms/roomsSlice";
import { useSelector } from "react-redux";
import { userSelector } from "@/model/users/userSlice";

// Custom Components

interface Props {
  topic: Statement;
}

const InRoom: FC<Props> = ({ topic }) => {
  try {
    const user = useSelector(userSelector);
    if (!user) return null;
    const participantInRoom = useSelector(participantByIdSelector(user.uid));

    return (
      <div className={styles.inRoom}>
        <h2>In Room: {topic.statement}</h2>
        <h3>Room Number: {participantInRoom?.roomNumber}</h3>
      </div>
    );
  } catch (error: any) {
    return null;
  }
};

export default InRoom;
