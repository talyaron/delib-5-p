import { Statement } from "delib-npm";
import { FC } from "react";
import styles from "./RoomChoosingCard.module.scss";
import { useSelector } from "react-redux";
import { participantsByTopicId, roomSettingsByStatementId } from "@/model/rooms/roomsSlice";
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
	const roomSettings = useSelector(roomSettingsByStatementId(topic.parentId));
	const participantsPerRoom = roomSettings?.participantsPerRoom || 7;

	function handleJoinRoom() {
		if (participant) {
      
			deleteParticipantToDB(topic);
		} else {
      
			setParticipantToDB(topic);
		}
	}
	let fill = (participants.length / participantsPerRoom) * 100;
	if(fill > 100) fill = 100;

	return (
		<button className={`${styles.roomCard} ${participant && styles["roomCard--selected"]}`} onClick={handleJoinRoom}>
			<div className={styles.title}>{topic.statement}</div>
			<div className={styles.amount}>{participants.length}/{participantsPerRoom}</div>
			<div className={styles.fill} style={{height:`${fill}%`, borderRadius:fill>90?"1rem":"0px 0px 1rem 1rem"}}></div>
		</button>
	);
};

export default RoomChoosingCard;
