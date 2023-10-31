import { ResultsBy, Statement } from 'delib-npm';
import { useState, FC } from 'react';
import Text from '../../../../components/text/Text';
import styles from './Document.module.scss';
import { updateResults } from '../../../../../functions/db/results/setResults';

interface Props {
    statement: Statement
}

const Document: FC<Props> = ({ statement }) => {
    const [resultsBy, setResultsBy] = useState<ResultsBy>(ResultsBy.topOption)

    const description = statement.statement.split('\n').slice(1).join('\n');

    function handleGetResults() {
        updateResults(statement.statementId, resultsBy)
    }




    return (
        <div className='page__main'>
            <div className="wrapper">
                <div className={styles.document}>
                    <h2><Text text={statement.statement} onlyTitle={true} /></h2>
                    <Text text={description} />

                </div>
                <section className={styles.results}>
                    <h2>תוצאות</h2>
                    <div className="btns">
                        <button onClick={handleGetResults}>הצגת תוצאות</button>
                    </div>
                    <select name="results" id="results" defaultValue={resultsBy} onChange={(ev) => setResultsBy(ev.target.value as ResultsBy)}>
                        <option value={ResultsBy.topOption}>אופציות מקסימליות</option>
                        <option value={ResultsBy.topVote}>הצבעות</option>
                    </select>
                </section>
            </div>
        </div>
    )
}

export default Document