import { Statement } from "delib-npm";
import { FC } from "react";
import AdminArrange from "./AdminArrange";
import _styles from "./admin.module.css";
import { t } from "i18next";
import SetTimers from "./setTimers/SetTimers";

const styles = _styles as any;

interface Props {
    statement: Statement;
}

const RoomsAdmin: FC<Props> = ({ statement }) => {
    return (
        <>
            <div className={styles.admin}>
                <p className={styles.title}>{t("Management board")}</p>
                <AdminArrange statement={statement} />
                <SetTimers />
            </div>
        </>
    );
};

export default RoomsAdmin;
