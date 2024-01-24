import { FC } from "react";

// Third Party Libraries
import { Participant, Statement } from "delib-npm";
import { t } from "i18next";

// Redux
import { useAppSelector } from "../../../../../../../functions/hooks/reduxHooks";
import { userSelectedTopicSelector } from "../../../../../../../model/rooms/roomsSlice";

// Styles
import styles from "./inRoom.module.scss";

// Custom Components
import Text from "../../../../../../components/text/Text";




interface Props {
    statement: Statement;
}

const InRoom: FC<Props> = ({ statement }) => {
    const userTopic: Participant | undefined = useAppSelector(
        userSelectedTopicSelector(statement.statementId),
    );

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
            </>
        );
    } catch (error: any) {
        return <div>error: {error.message}</div>;
    }
};

export default InRoom;
