import { FC, useEffect, useState } from "react";
import Modal from "../../../../../components/modal/Modal";
import { setInvitationToDB } from "../../../../../../controllers/db/invitations/setInvitation";
import { Invitation } from "delib-npm";

import styles from "./InvitePanel.module.scss";

interface Props {
  setShowModal: (show: boolean) => void;
  statementId?: string;
  pathname: string;
}

const InvitePanel: FC<Props> = ({ setShowModal, statementId, pathname }) => {
	try {

		if(!statementId) throw new Error("StatementId is missing");

		const [invitationNumber, setInvitationNumber] = useState<number | null>(
			null
		);

		useEffect(() => {
			setInvitationToDB({ statementId, pathname }).then(
				(invitation: Invitation | undefined) => {
					try {
						if (!invitation) throw new Error("No invitation found in DB");
						
						setInvitationNumber(invitation?.number);
					} catch (error) {
						console.error(error);
					}
				}
			);
		}, []);
		
		return (
			<Modal>
				<div className={styles.panel}>
					<h3  className={styles.panel__title}>Invite using Number:</h3>
					<h3 className={styles.panel__number}>{invitationNumber}</h3>
					<button onClick={() => setShowModal(false)}>Close</button>
				</div>
			</Modal>
		);
	} catch (error) {
		console.error(error);
		
		return null;
	}
};

export default InvitePanel;
