import { Statement } from "delib-npm";
import { FC, useState } from "react";
import AdminArrange from "../adminArrange/AdminArrange";
import SetTimers from "../setTimers/SetTimers";
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";
import "./RoomsAdmin.scss";

interface Props {
    statement: Statement;
}

const RoomsAdmin: FC<Props> = ({ statement }) => {
	const { t } = useLanguage();

	const [setRooms, setSetRooms] = useState<boolean>(
		statement.roomsState === "chooseRoom" ||
            statement.roomsState === undefined
			? false
			: true,
	);

	return (
		<div className="rooms-admin">
			<p className="title">{t("Management board")}</p>

			<AdminArrange
				statement={statement}
				setRooms={setRooms}
				setSetRooms={setSetRooms}
			/>
			{!setRooms && <SetTimers parentStatement={statement} />}
		</div>
	);
};

export default RoomsAdmin;
