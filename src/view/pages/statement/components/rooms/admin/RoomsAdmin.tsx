import { Statement } from "delib-npm";
import { FC, useState } from "react";
import AdminArrange from "./AdminArrange";
import _styles from "./admin.module.css";
import SetTimers from "./setTimers/SetTimers";
import { useLanguage } from "../../../../../../controllers/hooks/useLanguages";

const styles = _styles as any;

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
        <>
            <div className={styles.admin}>
                <p className={styles.title}>{t("Management board")}</p>
                <AdminArrange
                    statement={statement}
                    setRooms={setRooms}
                    setSetRooms={setSetRooms}
                />
                {!setRooms && <SetTimers parentStatement={statement} />}
            </div>
        </>
    );
};

export default RoomsAdmin;
