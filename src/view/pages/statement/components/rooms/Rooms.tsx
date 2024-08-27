import { RoomsStateSelection, Statement, StatementSubscription, isOptionFn } from "delib-npm";
import React, { FC, useState, useEffect } from "react";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";

// Custom components
import RoomsAdmin from "./components/roomsAdmin/RoomsAdmin";
import ChooseRoom from "./components/choose/ChooseRoom";
import InRoom from "./components/inRoom/InRoom";

import { store } from "@/model/store";

// database
import { listenToRooms } from "@/controllers/db/rooms/getRooms";
import { isAdmin} from "@/controllers/general/helpers";

interface RoomsProps {
  statement: Statement;
  subStatements: Statement[];
  statementSubscription:StatementSubscription | undefined;
}

const Rooms: FC<RoomsProps> = ({ statement, subStatements,statementSubscription }) => {
  

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToRooms(statement);

    return () => {
      unsubscribe();
    };
  }, []);

  const options = subStatements.filter((subStatement: Statement) =>
    isOptionFn(subStatement)
  );

  const _isAdmin = isAdmin(statementSubscription?.role);

  return (
    <div className="page__main">
      {switchRoomScreens(
        statement.roomsState,
        options,
        statement,
        setShowModal
      )}

      {_isAdmin ? <RoomsAdmin statement={statement} /> : null}

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

export default Rooms;

function switchRoomScreens(
  roomState: RoomsStateSelection | undefined,
  topics: Statement[],
  statement: Statement,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) {
  switch (roomState) {
    case RoomsStateSelection.chooseRoom:
      return (
        <ChooseRoom topics={topics} setShowModal={setShowModal} />
      );
    case RoomsStateSelection.inRoom:
      return <InRoom topic={statement} />;

    default:
      return (
        <ChooseRoom topics={topics} setShowModal={setShowModal} />
      );
  }
}
