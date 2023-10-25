import { Statement } from 'delib-npm';
import { FC } from 'react';
import { useAppSelector } from '../../../../../../../functions/hooks/reduxHooks';
import { userSelectedTopicSelector } from '../../../../../../../model/statements/statementsSlice';

import LoaderGlass from '../../../../../../components/loaders/LoaderGlass';
import _styles from './roomDivide.module.scss';
import Text from '../../../../../../components/text/Text';
const styles = _styles as any;



interface Props {
  statement: Statement;
}


const RoomQuestions: FC<Props> = ({ statement }) => {

  const userTopic = useAppSelector(userSelectedTopicSelector(statement.statementId));
  // const userRoom = useAppSelector(userSelectedRoomSelector(statement.statementId));

 
  try {

    return (
      <>
        <h1>חלוקה לחדרים</h1>
        {userTopic && userTopic.approved ?
          <div className={styles.message}>
            <h2><Text text={`נושא הדיון: ${userTopic.statement.statement}`} onlyTitle={true}/></h2>
            <div className={styles.text}>מוזמן/ת לחדר מספר <span>{userTopic.roomNumber}</span> בזום</div>
          </div>
          :
          <div className={styles.container} style={{flexDirection:"column"}}>
            <h2>אנא המתינו לחלוקה לחדרים...</h2>
            <LoaderGlass />
          </div>
        }
      </>
    )
  } catch (error: any) {
    return (<div>error: {error.message}</div>)
  }
}

export default RoomQuestions