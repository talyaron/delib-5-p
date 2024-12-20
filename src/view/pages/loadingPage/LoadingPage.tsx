import LoaderGlass from "../../components/loaders/LoaderGlass";
import styles from "./loadingPage.module.scss";

import { useLanguage } from "@/controllers/hooks/useLanguages";

const LoadingPage = () => {
	const { t } = useLanguage();

	return (
		<div className={styles.loader}>
			<div className={styles.box}>
				<h1>{t("FreeDi: Empowering Agreements")}</h1>
				<LoaderGlass />
				<h2>{t("Please wait while the page loads")}</h2>
			</div>
		</div>
	);
};

export default LoadingPage;
