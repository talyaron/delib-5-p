import { ResultsBy, Statement } from 'delib-npm';
import { useState, FC } from 'react';
import Text from '../../../../components/text/Text';
import styles from './Document.module.scss';
import { updateResults } from '../../../../../functions/db/results/setResults';


interface Props {
    statement: Statement,
    subStatements: Statement[]
}

const Document: FC<Props> = ({ statement, subStatements }) => {
    const [resultsBy, setResultsBy] = useState<ResultsBy>(statement.resultsBy || ResultsBy.topOption)
    const [results, setResults] = useState<Statement[]>([]);
    const description = statement.statement.split('\n').slice(1).join('\n');

    function handleGetResults() {
        updateResults(statement.statementId, resultsBy)
        setResults(getResults(statement, subStatements));
        console.log(top)
    }




    return (
        <div className='page__main'>
            <div className="wrapper">
                <section className={styles.document}>
                    <h2><Text text={statement.statement} onlyTitle={true} /></h2>
                    <Text text={description} />

                </section>
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
                <section className={styles.subStatements}>
                    <h2>תוצאות</h2>
                    {results.map(result => <Text key={result.statementId} text={result.statement} />)}
                </section>
            </div>
        </div>
    )
}

export default Document;

function getResults(statement: Statement, subStatements: Statement[]): Statement[] {
    try {
        console.log(statement.resultsBy)
        console.log(subStatements)
        switch (statement.resultsBy) {
            case ResultsBy.topVote:
                const { selections } = statement;
                if (!selections) throw new Error('No selections (votes) in statement');
                const maxVoteKey = Object.keys(selections).reduce((a, b) => selections[a] > selections[b] ? a : b);
                const maxVoteStatement: Statement | undefined = subStatements.find(subStatement => subStatement.statementId === maxVoteKey);
                if (!maxVoteStatement) throw new Error('No statement found with max vote key');
                return [maxVoteStatement];


            default:
                return []
        }
    } catch (error) {
        console.error(error);
        return []
    }
}