import {FC} from 'react';
import styles from './NewMessages.module.scss';
// import { t } from 'i18next';

interface Props{
    newMessages: number
    setNewMessages: React.Dispatch<React.SetStateAction<number>>
    scrollToBottom: ()=>void
}

const NewMessages:FC<Props> = ({newMessages,setNewMessages,scrollToBottom}) => {
    if(newMessages === 0) return null;
  
// return (
//     <div className={styles.newMessages} onClick={()=>{
//         setNewMessages(0)
//         scrollToBottom()
        
//     }}>{t("New Messages")}: {newMessages}</div>
//   )

  return (
    <div className={styles.newMessages} onClick={()=>{
        setNewMessages(0)
        scrollToBottom()
        
    }}> {newMessages}</div>
  )
}

export default NewMessages