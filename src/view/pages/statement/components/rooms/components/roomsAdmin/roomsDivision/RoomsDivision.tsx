import { FC, useEffect, useState } from "react";
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
	const [participantsPerRoom, _setParticipantsPerRoom] = useState(7);

	useEffect(() => {
		if (roomSettings) {
			_setParticipantsPerRoom(roomSettings.participantsPerRoom || 7);
		}
	}, [roomSettings]);

	function handleToggleEdit() {
		toggleRoomEditingInDB(statement.statementId);

		divideParticipantIntoRoomsToDB(
			topics,
			participants,
			roomSettings?.participantsPerRoom || 7
		);
	}

	function handleSetParticipantsPerRoom(add: number) {
		_setParticipantsPerRoom(value=>value+add);
		setParticipantsPerRoom({ statementId: statement.statementId, add });
	}

	function handleSetParticipantsPerRoomNumber(number: number) {
		_setParticipantsPerRoom(number);
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
			<div className={styles.title}>{t("Number of participants per room")}</div>
			<div className={styles.participantsPerRoom}>
				<button
					className={styles.add}
					onClick={() => handleSetParticipantsPerRoom(1)}
				>
          +
				</button>
				<input
					type="number"
					aria-label="Number of participants Per Room"
					value={participantsPerRoom}
					onChange={(e) =>
						handleSetParticipantsPerRoomNumber(e.target.valueAsNumber)
					}
				/>
				<button
					className={styles.add}
					onClick={() => handleSetParticipantsPerRoom(-1)}
				>
          -
				</button>
			</div>
		</>
	);
};

export default RoomsDivision;
