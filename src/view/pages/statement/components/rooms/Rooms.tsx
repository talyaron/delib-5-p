import { RoomsStateSelection, Statement, StatementSubscription, isOptionFn } from "delib-npm";
import React, { FC, useState, useEffect } from "react";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";

// Custom components
import RoomsAdmin from "./components/roomsAdmin/RoomsAdmin";
import ChooseRoom from "./components/choose/ChooseRoom";
import InRoom from "./components/inRoom/InRoom";


// database
import { listenToRooms } from "@/controllers/db/rooms/getRooms";
import { isAdmin} from "@/controllers/general/helpers";


interface RoomsProps {
  statement: Statement;
  subStatements: Statement[];
  statementSubscription:StatementSubscription | undefined;
}

const Rooms: FC<RoomsProps> = ({ statement, subStatements,statementSubscription }) => {
  


  useEffect(() => {
    const unsubscribe = listenToRooms(statement);

    return () => {
      unsubscribe();
    };
  }, []);

  const topics = subStatements.filter((subStatement: Statement) =>
    isOptionFn(subStatement)
  );

  const _isAdmin = isAdmin(statementSubscription?.role);

  return (
    <div className="page__main">
      {switchRoomScreens(
        statement.roomsState,
        topics,
        statement      
      )}

      {_isAdmin ? <RoomsAdmin statement={statement} /> : null}

      
    </div>
  );
};

export default Rooms;

function switchRoomScreens(
  roomState: RoomsStateSelection | undefined,
  topics: Statement[],
  statement: Statement,

) {
  switch (roomState) {
    case RoomsStateSelection.chooseRoom:
      return (
        <ChooseRoom topics={topics} statement={statement}/>
      );
    case RoomsStateSelection.inRoom:
      return <InRoom topic={statement} />;

    default:
      return (
        <ChooseRoom topics={topics} statement={statement} />
      );
  }
}
