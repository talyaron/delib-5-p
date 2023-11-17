import { Statement } from 'delib-npm';
import {FC} from 'react';
import styles from './Solutions.module.scss';

interface Props {
    statement: Statement;
}

const Solutions:FC<Props> = ({statement}) => {
    const {results} = statement;
    const solutions = results?.solutions as Array<Statement>;

  return (
    <div className={styles.solutions}>
        {solutions.map((solution:Statement) => <div key={`solutions-${solution.statementId}`} className={styles.solution}>{solution.statement}</div>)}
    </div>
  )
}

export default Solutions;