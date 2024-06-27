import { Statement } from 'delib-npm'
import {FC} from 'react'
interface Props{
    statement:Statement;
}

const Info:FC<Props> = ({statement}) => {
  return (
    <div>Info:{statement.statement}</div>
  )
}

export default Info