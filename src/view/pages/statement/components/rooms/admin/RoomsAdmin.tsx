import { Statement } from "delib-npm";
import { FC } from "react";
import AdminChoose from "./AdminChoose";
import _styles from "./admin.module.css";
import { t } from "i18next";

const styles = _styles as any;

interface Props {
    statement: Statement;
}

const RoomsAdmin: FC<Props> = ({ statement }) => {
    return (
        <>
            <div className={styles.admin}>
                <p className={styles.title}>{t("Management board")}</p>
                <AdminChoose statement={statement} />
            </div>
        </>
    );
};

export default RoomsAdmin;
