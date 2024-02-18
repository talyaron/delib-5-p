import { t } from "i18next";
import styles from "./loadingPage.module.scss";

import LoaderGlass from "../../components/loaders/LoaderGlass";

const LoadingPage = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.box}>
                <h1>{t("Delib: We create agreements together")}</h1>
                <LoaderGlass />
                <h2>{t("Please wait while the page loads")}</h2>
            </div>
        </div>
    );
};

export default LoadingPage;
