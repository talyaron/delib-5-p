import { Participant, Statement } from "delib-npm";
import { FC } from "react";
import Text from "@/view/components/text/Text";
import { setRoomJoinToDB } from "@/controllers/db/rooms/setRooms";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { statementSelector } from "@/model/statements/statementsSlice";
import {
	topicParticipantsSelector,
	userSelectedTopicSelector,
} from "@/model/rooms/roomsSlice";
import styles from "./RoomChoosingCard.module.scss";

interface Props {
    statement: Statement;
}

const RoomChoosingCard: FC<Props> = ({ statement }) => {
	const request = useAppSelector(
		userSelectedTopicSelector(statement.parentId),
	);
	const roomSize =
        useAppSelector(statementSelector(statement.parentId))?.roomSize || 5;
	const requestStatementId = request?.statement?.statementId;

	const topicJoiners = useAppSelector(
		topicParticipantsSelector(statement.statementId),
	) as Participant[];

	function handleAskToJoinRoom() {
		setRoomJoinToDB(statement);
	}

	const fill = fillHeight(topicJoiners, roomSize);
	const borderRadius = fill > 0.9 ? `1rem` : "0px 0px 1rem 1rem";

	return (
		<div
			className={
				requestStatementId === statement.statementId
					? `${styles.roomCard} ${styles["roomCard--selected"]}`
					: `${styles.roomCard}`
			}
			onClick={handleAskToJoinRoom}
		>
			<div className={styles.roomCard__title}>
				<Text statement={statement.statement} />
			</div>
			<div className={styles.roomCard__count}>
				<span>{topicJoiners ? topicJoiners.length : 0}</span>/
				{roomSize || 7}
			</div>
			<div
				className={styles.roomCard__fill}
				style={{
					height: `${fill * 100}%`,
					borderRadius,
					backgroundColor: fillColor(fill),
				}}
			></div>
		</div>
	);
};

export default RoomChoosingCard;

function fillHeight(topicJoiners: Participant[], maxRoomJoiners = 5) {
	try {
		if (!topicJoiners) return 0;

		const joinersCount = topicJoiners.length;
		const fill = joinersCount / maxRoomJoiners;
		if (fill > 1) return 1;

		return fill;
	} catch (error) {
		console.error(error);

		return 0;
	}
}

function fillColor(fill: number) {
	if (fill < 0.25) return "#c502024b";
	if (fill < 0.5) return "#c595024b";
	if (fill < 0.75) return "#c4c5024b";
	if (fill >= 1) return "rgba(2, 197, 2, 0.294)";

	return "gray";
}
