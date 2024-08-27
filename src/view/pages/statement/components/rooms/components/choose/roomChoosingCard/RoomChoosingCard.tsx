import { Statement } from 'delib-npm'
import {FC} from 'react'

interface Props {
  topic: Statement;
}
const RoomChoosingCard:FC<Props> = ({topic}) => {
  return (
	<div>{topic.statement}</div>
  )
}

export default RoomChoosingCard