import { ResultsBy, SimpleStatement, Statement } from 'delib-npm';
import { FC } from 'react';
import styles from './Solutions.module.scss';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';


interface Props {
    statement: Statement;
}

const Solutions: FC<Props> = ({ statement }) => {

    const { results, resultsSettings } = statement;
  
    console.log( results, resultsSettings)

    if (!results || !resultsSettings) {
        return null;
    }


    const solutions: SimpleStatement[] = resultsSettings.resultsBy === ResultsBy.topOptions ? results.consensus : results.votes || [];

    return (
        <div className={styles.solutions}>
            <section>
                <ChecklistRtlIcon />
                הסכמות
            </section>
            <div>
                {solutions.map((solution: SimpleStatement) => <p key={`solutions-${solution.statementId}`} className={styles.solution}>
                    {solution.statement}
                </p>)}
            </div>
        </div>
    )
}

export default Solutions;