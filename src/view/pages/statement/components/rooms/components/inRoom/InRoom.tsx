import { FC } from "react";
import { Statement } from "delib-npm";
import {
	participantByIdSelector,
	participantsByStatementIdAndRoomNumber,
} from "@/model/rooms/roomsSlice";

// Redux
import { useSelector } from "react-redux";
import { userSelector } from "@/model/users/userSlice";

// Styles
import styles from "./InRoom.module.scss";
import RoomImage from "@/assets/images/roomImage.png";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import RoomParticipantBadge from "../roomParticipantBadge/RoomParticipantBadge";

// Custom Components

interface Props {
  topic: Statement;
}

const InRoom: FC<Props> = ({ topic }) => {
	try {
		const user = useSelector(userSelector);
		const {t} = useLanguage();

		if (!user) return null;
		const participantInRoom = useSelector(participantByIdSelector(user.uid));
		const roomNumber = participantInRoom?.roomNumber || 0;
		const participants = useSelector(
			participantsByStatementIdAndRoomNumber(topic.statementId, roomNumber)
		);

		return (
			<div className={styles.inRoom}>
				<div className={styles.wrapper}>
					<div className={styles.room}>{t("Welcome to room")} {roomNumber}</div>
					<div className={styles.topic}>
						{t("Topic")}: {participantInRoom?.statement.statement}
					</div>
					<div
						className={styles.image}
						style={{ backgroundImage: `url(${RoomImage})` }}
					></div>
					<div>{t("Participants")}:</div>
					<div className={styles.participants}>
           
						{participants.map((participant) => {
							return (
								<RoomParticipantBadge
									key={participant.user.uid}
									participant={participant}
								/>
							);
						})}
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error(error);
		
		return null;
	}
};

export default InRoom;
