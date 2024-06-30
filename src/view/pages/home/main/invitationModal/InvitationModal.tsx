import { FC, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import styles from "./InvitationModal.module.scss";
import { getInvitationPathName } from "../../../../../controllers/db/invitations/getInvitations";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../../controllers/hooks/useLanguages";

interface Props {
  setShowModal: (show: boolean) => void;
}
const InvitationModal: FC<Props> = ({ setShowModal }) => {
	const navigate = useNavigate();
	const {t} = useLanguage();

	const [errorMessage, setErrorMessage] = useState<string>("");

	async function handleJoin(ev) {
		try {
			ev.preventDefault();
			if (!ev.target.pin.value) throw new Error("No pin value");
	
			const pathname = await getInvitationPathName(ev.target.pin.value);
			if (!pathname) {
				setErrorMessage(t("Couldn't find the invitation. Please check the PIN and try again."));
				
				return;
      
			}
			setShowModal(false);
			navigate(pathname);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Modal>
			<div className={styles.invitation}>
				<form className={styles.invitation__form} onSubmit={handleJoin}>
					<input
						type="number"
						placeholder="Enter PIN"
						id="pin"
						required={true}
					/>
					{errorMessage && <div className={styles.invitation__error}>{errorMessage}</div>}
					<div className="btns">
						<button type="submit" className="btn btn--agree">{t("Join")}</button>
						<button onClick={()=>setShowModal(false)} className="btn btn--cancel">{t("Cancel")}</button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default InvitationModal;
