import { FC, useEffect, useState } from "react";
import { setInvitationToDB } from "../../../../../../controllers/db/invitations/setInvitation";
import { Invitation } from "delib-npm";

import styles from "./InvitePanel.module.scss";
import XIcon from "../../../../../components/icons/XIcon";
import InvitePanelBox from "./InvitePanelBox";
import InviteModal from "../../../../../components/modal/InviteModal";

interface Props {
  setShowModal: (show: boolean) => void;
  statementId?: string;
  pathname: string;
}

const InvitePanel: FC<Props> = ({ setShowModal, statementId, pathname }) => {
	try {
		if (!statementId) throw new Error("StatementId is missing");

		const [invitationNumberArr, setInvitationNumberArr] = useState<number[]>(
			[]
		);

		useEffect(() => {
			setInvitationToDB({ statementId, pathname }).then(
				(invitation: Invitation | undefined) => {
					try {
						if (!invitation) throw new Error("No invitation found in DB");

						invitationNumberToArray(invitation?.number);
					} catch (error) {
						console.error(error);
					}
				}
			);
		}, []);

		function invitationNumberToArray(invitationNumber: number) {
			let number = invitationNumber;
			const newNumber: number[] = [];
			while (number > 0) {
				newNumber.push(number % 10);
				number = Math.floor(number / 10);
			}

			return setInvitationNumberArr(newNumber);
		}

		return (
			<InviteModal>
				<div className={styles.panel}>
					<div className={styles.panel__boxWrapper}>
						{invitationNumberArr.map((number,i) => {
							return <InvitePanelBox number={number} key={i}/>;
						})}
					</div>
					<button onClick={() => setShowModal(false)}>
						<XIcon />
					</button>
				</div>
			</InviteModal>
		);
	} catch (error) {
		console.error(error);
		
		return null;
	}
};
export default InvitePanel;