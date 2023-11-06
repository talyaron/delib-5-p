import {  RoomAskToJoin, Statement } from 'delib-npm';
import { FC } from 'react';
import Text from '../../../../../../components/text/Text';
import { askToJoinRoomDB } from '../../../../../../../functions/db/rooms/setRooms';
import { useAppSelector } from '../../../../../../../functions/hooks/reduxHooks';
import { statementSelector, topicParticipantsSelector, userSelectedTopicSelector } from '../../../../../../../model/statements/statementsSlice';

interface Props {
  statement: Statement
}

const StatementRoomCard: FC<Props> = ({ statement }) => {
  const request = useAppSelector(userSelectedTopicSelector(statement.parentId));
  const roomSize = useAppSelector(statementSelector(statement.parentId))?.roomSize || 5;
  const requestStatementId = request?.statement?.statementId;

  const topicJoiners = useAppSelector(topicParticipantsSelector(statement.statementId)) as RoomAskToJoin[];


  function handleAskToJoinRoom() {
    try {

      askToJoinRoomDB(statement)
    } catch (error) {
      console.error(error);
    }
  }

  const fill = fillHieght(topicJoiners, roomSize);
  const borderRadius = fill > .9 ? `1rem` : '0px 0px 1rem 1rem';
 

  return (
    <div className={requestStatementId === statement.statementId ? "roomCard roomCard--selected" : "roomCard"} onClick={handleAskToJoinRoom}>
      <div className="roomCard__title">
        <Text text={statement.statement} />
      </div>
      <div className="roomCard__count">
        <span>{topicJoiners?topicJoiners.length:0}</span>/{roomSize || 7}
      </div>
      <div className="roomCard__fill" style={{height:`${fill*100}%`, borderRadius, backgroundColor:fillColor(fill)}}></div>
    </div>
  )
}

export default StatementRoomCard

function fillHieght(topicJoiners:RoomAskToJoin[], maxRoomJoiners:number = 5) {
  try {
    if(!topicJoiners) return 0;

    const joinersCount = topicJoiners.length;
    const fill = joinersCount/maxRoomJoiners;
    if(fill > 1) return 1;
    return fill;

  } catch (error) {
    console.error(error);
    return 0;
  }
}

function fillColor(fill:number) {
  if(fill < .25) return '#c502024b';
  if(fill < .5) return '#c595024b';
  if(fill < .75) return '#c4c5024b';
  if(fill >= 1) return 'rgba(2, 197, 2, 0.294)';
 
  
 
  return 'gray';
}