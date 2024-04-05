import { FC, useEffect } from "react";

// // Third Party Libraries
import { Participant, RoomTimer, Statement } from "delib-npm";

// Redux
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../../../functions/hooks/reduxHooks";
import { userSelectedTopicSelector } from "../../../../../../../model/rooms/roomsSlice";

// // Styles
import styles from "./InRoom.module.css";

// Custom Components
import Text from "../../../../../../components/text/Text";
import RoomTimers from "../../timer/RoomTimers";
import { listenToRoomTimers } from "../../../../../../../functions/db/timer/getTimer";
import { Unsubscribe } from "firebase/firestore";
import { selectRoomTimers } from "../../../../../../../model/timers/timersSlice";
import { useLanguage } from "../../../../../../../functions/hooks/useLanguages";

interface Props {
    statement: Statement;
}

const InRoom: FC<Props> = ({ statement }) => {
    const { t } = useLanguage();

    const userTopic: Participant | undefined = useAppSelector(
        userSelectedTopicSelector(statement.statementId),
    );
    const timers: RoomTimer[] = useAppSelector(selectRoomTimers);

    const dispatch = useAppDispatch();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        let unsub: Unsubscribe = () => {};
        if (userTopic?.roomNumber) {
            unsub = listenToRoomTimers(
                statement.statementId,
                userTopic?.roomNumber,
                dispatch,
            );
        }

        return () => {
            unsub();
        };
    }, [userTopic?.roomNumber]);

    try {
        return (
            <>
                <h1>{t("Room Allocation")}</h1>
                {/* {userTopic && userTopic.approved ? */}
                <div className={styles.message}>
                    {userTopic && userTopic.statement ? (
                        <>
                            <h2>
                                <Text
                                    text={`${
                                        (t("Discussion Topic:"),
                                        userTopic.statement.statement)
                                    }`}
                                    onlyTitle={true}
                                />
                            </h2>
                            <div className={styles.text}>
                                {t("Welcome to Room Number")}
                                <span>{userTopic.roomNumber}</span>
                                {t("In Zoom")}
                            </div>
                        </>
                    ) : (
                        <h2>{t("No Topic Chosen by You")}</h2>
                    )}
                </div>
                <RoomTimers
                    roomNumber={userTopic?.roomNumber}
                    timers={timers}
                />
            </>
        );
    } catch (error: any) {
        return <div>error: {error.message}</div>;
    }
};

export default InRoom;
