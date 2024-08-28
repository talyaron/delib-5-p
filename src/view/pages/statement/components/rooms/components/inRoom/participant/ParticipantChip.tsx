import { ParticipantInRoom } from "delib-npm";
import { FC } from "react";
import styles from "./ParticipantChip.module.scss";
interface Props {
  participant: ParticipantInRoom;
}

const ParticipantChip:FC<Props> = ({ participant }) => {
  return <div className={styles.participant}>{participant.user.displayName}</div>;
};

export default ParticipantChip;
