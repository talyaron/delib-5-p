import { Statement, StatementType } from 'delib-npm'
import {FC} from 'react'

interface Props{
    statement:Statement,
    subStatements:Statement[]
}

const MassQuestions:FC<Props> = ({statement, subStatements}) => {
    const questions = subStatements.filter(sub=>sub.statementType === StatementType.question)
  return (
    <div className='page__main'>
      
        <h2>Questions</h2>
        <ul>
            {questions.map((question, index)=><li key={index}>{question.statement}</li>)}
        </ul>
    </div>
  )
}

export default MassQuestions