import { User } from 'delib-npm'
import {FC} from 'react'

interface Props {
    participant:User
}

const RoomParticpantBadge:FC<Props> = ({participant}) => {
  return (
    <div className='badge'>{participant.displayName}</div>
  )
}

export default RoomParticpantBadge