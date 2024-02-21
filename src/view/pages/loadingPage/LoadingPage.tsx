import styles from "./loadingPage.module.scss";

import LoaderGlass from "../../components/loaders/LoaderGlass";
import { useLanguage } from "../../../functions/hooks/useLanguages";

const LoadingPage = () => {
    const { languageData } = useLanguage();

    return (
        <div className={styles.loader}>
            <div className={styles.box}>
                <h1>{languageData["Delib: We create agreements together"]}</h1>
                <LoaderGlass />
                <h2>{languageData["Please wait while the page loads"]}</h2>
            </div>
        </div>
    );
};

export default LoadingPage;
