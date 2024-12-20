import styles from "./InvitationModal.module.scss";
import InvitationModalInputBox from "./InvitationModalInputBox";

type Props = {
  maxInvitation: number | undefined;
};

function InvitationModalInputBoxWrapper({ maxInvitation }: Props) {
	if (maxInvitation === undefined) {
		return null;
	}

	const inputBoxes = Array.from({ length: maxInvitation }, (_, i) => (
		<InvitationModalInputBox key={i} id={`pin${i}`} />
	));

	return (
		<div className={styles.invitation__form__inputBoxWrapper}>
			{inputBoxes}
		</div>
	);
}

export default InvitationModalInputBoxWrapper;