import { FC, useEffect } from "react";

// // Third Party Libraries
import { Participant, RoomTimer, Statement } from "delib-npm";

// Redux
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../controllers/hooks/reduxHooks";
import { userSelectedTopicSelector } from "../../../../../../../model/rooms/roomsSlice";

// Styles
import "./InRoom.scss";

// Custom Components
import RoomTimers from "../roomTimer/Timers";
import { listenToRoomTimers } from "../../../../../../../controllers/db/timer/getTimer";
import { Unsubscribe } from "firebase/firestore";
import { selectRoomTimers } from "../../../../../../../model/timers/timersSlice";
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";
import { getTitle } from "../../../../../../../controllers/general/helpers";

interface Props {
  statement: Statement;
}

const InRoom: FC<Props> = ({ statement }) => {
  const { t } = useLanguage();

  const userTopic: Participant | undefined = useAppSelector(
    userSelectedTopicSelector(statement.statementId)
  );

  const timers: RoomTimer[] = useAppSelector(selectRoomTimers);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribe: Unsubscribe = () => {};
    if (userTopic?.roomNumber) {
      unsubscribe = listenToRoomTimers(
        statement.statementId,
        userTopic?.roomNumber,
        dispatch
      );
    }

    return () => {
      unsubscribe();
    };
  }, [userTopic?.roomNumber]);

  try {
    return (
      <div className="in-room">
        {userTopic && userTopic.statement ? (
          <div className="welcome">
            <h2>
              {t("Welcome to room")} {userTopic?.roomNumber}
            </h2>
            <h3>{getTitle(userTopic?.statement)}</h3>
          </div>
        ) : (
          <h2>{t("No Topic Chosen by You")}</h2>
        )}
		<div className="image"></div>
        <RoomTimers roomNumber={userTopic?.roomNumber} timers={timers} />
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return <div>error: {error.message}</div>;
  }
};

export default InRoom;
