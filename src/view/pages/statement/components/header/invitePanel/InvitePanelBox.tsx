import styles from './InvitePanel.module.scss';

type Props = {number:number}

function InvitePanelBox({number}: Props) {
	return (
		<input className={styles.panel__boxWrapper__box} readOnly={true} value={number}/>
	)
}

export default InvitePanelBox