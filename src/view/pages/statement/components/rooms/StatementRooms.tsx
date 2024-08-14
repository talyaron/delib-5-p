import { RoomsStateSelection, Statement, isOptionFn } from "delib-npm";
import React, { FC, useState, useEffect } from "react";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";
import { listenToAllRoomsRequest } from "@/controllers/db/rooms/getRooms";
import { useAppDispatch } from "@/controllers/hooks/reduxHooks";

import RoomsAdmin from "./components/roomsAdmin/RoomsAdmin";
import ChooseRoom from "./components/choose/ChooseRoom";

// import InRoom from "./user/inRoom/InRoom";
import { store } from "@/model/store";
import { enterRoomsDB } from "@/controllers/db/rooms/setRooms";
import InRoom from "./components/inRoom/InRoom";

interface StatementRoomsProps {
  statement: Statement;
  subStatements: Statement[];
}

const StatementRooms: FC<StatementRoomsProps> = ({
	statement,
	subStatements,
}) => {
	const dispatch = useAppDispatch();

	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		enterRoomsDB(statement);

		const unsubscribe = listenToAllRoomsRequest(statement, dispatch);

		return unsubscribe;
	}, []);

	const __subStatements = subStatements.filter((subStatement: Statement) =>
		isOptionFn(subStatement)
	);

	const isAdmin = store.getState().user.user?.uid === statement.creatorId;

	return (
		<div className="page__main">
      
			{switchRoomScreens(
				statement.roomsState,
				__subStatements,
				statement,
				setShowModal
			)}

			{isAdmin ? <RoomsAdmin statement={statement} /> : null}

			{showModal ? (
				<CreateStatementModal
					parentStatement={statement}
					isOption={true}
					setShowModal={setShowModal}
				/>
			) : null}
   
		</div>
	);
};

export default StatementRooms;

function switchRoomScreens(
	roomState: RoomsStateSelection | undefined,
	subStatements: Statement[],
	statement: Statement,
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) {
	switch (roomState) {
	case RoomsStateSelection.chooseRoom:
		return (
			<ChooseRoom subStatements={subStatements} setShowModal={setShowModal} />
		);
	case RoomsStateSelection.inRoom:
		return <InRoom statement={statement} />;

	default:
		return (
			<ChooseRoom subStatements={subStatements} setShowModal={setShowModal} />
		);
	}
}
