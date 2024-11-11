import styles from './InvitationModal.module.scss';

type Props = {
	id: string;
};

function InvitationModalInputBox({ id }: Props) {
	return (
		<input
			className={styles.invitation__form__inputBoxWrapper__input}
			maxLength={1}
			placeholder="0"
			id={id}
		></input>
	);
}
export default InvitationModalInputBox;
