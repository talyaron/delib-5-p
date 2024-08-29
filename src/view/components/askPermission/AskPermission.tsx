import { FC } from "react";
import Modal from "../modal/Modal";
import notifications from "@/assets/images/notifications.png";
import styles from "./AskPermission.module.scss";
import { useLanguage } from "@/controllers/hooks/useLanguages";

interface Props {
	showFn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AskPermission: FC<Props> = ({ showFn }) => {
	const { t } = useLanguage();

	return (
		<Modal>
			<div className={styles.notifications}>
				<h2>{t("So you can communicate")}</h2>
				<p>
					{t("It is necessary to receive notifications")}
				</p>
				<p> {t("Please confirm alerts for Delib")}</p>
				<img
					src={notifications}
					alt={t("Explain how to open the notifications")}
				/>
				<div className="btns">
					<button
						className="btn btn--cancel"
						onClick={() => showFn(false)}
					>
						{t("Close")}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default AskPermission;
