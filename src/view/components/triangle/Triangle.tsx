import {FC} from 'react';
import styles from  './Triangle.module.scss';
import { Statement } from 'delib-npm';

interface Props{
    statement:Statement;
    
}

const Triangle:FC<Props> = ({statement}) => {
  return (
    <div className={styles.triangle}>
        <div className={styles.dot} style={{top:"5px", left:"0px"}}></div>
    </div>
  )
}

export default Triangle