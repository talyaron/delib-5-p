import {
  RoomsStateSelection,
  Statement,
  StatementSubscription,
  isOptionFn,
} from "delib-npm";
import React, { FC, useState, useEffect } from "react";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";

// Custom components
import RoomsAdmin from "./components/roomsAdmin/RoomsAdmin";
import ChooseRoom from "./components/choose/ChooseRoom";
import InRoom from "./components/inRoom/InRoom";

// database
import {
  listenToParticipants,
  listenToRoomsSettings,
} from "@/controllers/db/rooms/getRooms";
import { isAdmin } from "@/controllers/general/helpers";
import { useSelector } from "react-redux";
import { roomSettingsByStatementId } from "@/model/rooms/roomsSlice";
import { is } from "node_modules/cypress/types/bluebird";

interface RoomsProps {
  statement: Statement;
  subStatements: Statement[];
  statementSubscription: StatementSubscription | undefined;
}

const Rooms: FC<RoomsProps> = ({
  statement,
  subStatements,
  statementSubscription,
}) => {
  const roomSettings = useSelector(
    roomSettingsByStatementId(statement.statementId)
  );
  const isEditingRoom = roomSettings?.isEdit !== undefined ? roomSettings?.isEdit : true;

  useEffect(() => {
    const unsubscribe = listenToParticipants(statement);
    const unsubSettings = listenToRoomsSettings(statement.statementId);

    return () => {
      unsubscribe();
      unsubSettings();
    };
  }, []);

  const topics = subStatements.filter((subStatement: Statement) =>
    isOptionFn(subStatement)
  );

  const _isAdmin = isAdmin(statementSubscription?.role);

  return (
    <div className="page__main">
      {switchRoomScreens(isEditingRoom, topics, statement)}

      {_isAdmin ? <RoomsAdmin statement={statement} /> : null}
    </div>
  );
};

export default Rooms;

function switchRoomScreens(
  isEditingRoom: boolean,
  topics: Statement[],
  statement: Statement
) {
  console.log(isEditingRoom);
  if (isEditingRoom) {
    return <ChooseRoom topics={topics} statement={statement} />;
  } else {
    return <InRoom topic={statement} />;
  }
}
