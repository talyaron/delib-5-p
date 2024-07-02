
import styles from './InvitePanel.module.scss';
type Props = {number:number}

function InvitePanelBox({number}: Props) {
  return (
    <div className={styles.panel__boxWrapper__box}>{number}</div>
  )
}

export default InvitePanelBox