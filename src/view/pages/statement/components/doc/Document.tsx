import { ResultsBy, Statement } from 'delib-npm';
import { useState, FC } from 'react';
import Text from '../../../../components/text/Text';
import styles from './Document.module.scss';
import { updateResults } from '../../../../../functions/db/results/setResults';

import { maxKeyInObject } from '../../../../../functions/general/helpers';
import { getResultsFromDB } from '../../../../../functions/db/results/getResults';
import Slider from '@mui/material/Slider';



interface Props {
    statement: Statement,
    subStatements: Statement[]
}

const Document: FC<Props> = ({ statement, subStatements }) => {
    const [resultsBy, setResultsBy] = useState<ResultsBy>(statement.results?.resultsBy || ResultsBy.topOptions)
    const [results, setResults] = useState<Statement[]>([]);
    const description = statement.statement.split('\n').slice(1).join('\n');

    async function handleGetResults(ev: any) {
        try {
            console.dir(ev.target)
            //get form data with formData
            ev.preventDefault();

            const data = new FormData(ev.target);
            const resultsBy = data.get('results') as ResultsBy;
            const numberOfResults = Number(data.get('numberOfResults'));
            const deep = Number(data.get('deep'));


            setResultsBy(resultsBy)

            console.log("updateResults", resultsBy, numberOfResults, deep)
            updateResults(statement.statementId, resultsBy);

            const top = await getResults(statement, subStatements, resultsBy, numberOfResults, deep);
            setResults(top);
            console.log(top)
        } catch (error) {
            console.error(error);
        }

    }




    return (
        <div className='page__main'>
            <div className="wrapper">
                <section className={styles.document}>
                    <h2><Text text={statement.statement} onlyTitle={true} /></h2>
                    <Text text={description} />

                </section>
                <section className={styles.resultsWrapper}>
                    <h2>תוצאות</h2>
                    <form onSubmit={handleGetResults}>
                        <div className="btns">
                            <button type="submit">הצגת תוצאות</button>
                        </div>
                        <select name="results" id="results" defaultValue={resultsBy}>
                            <option value={ResultsBy.topOptions}>אופציות מקסימליות</option>
                            <option value={ResultsBy.topVote}>הצבעות</option>
                        </select>
                        <label htmlFor="">כמות פתרונות בכל רמה</label>
                        <Slider defaultValue={statement.results?.numberOfResults || 1} min={1} max={10} aria-label="Default" valueLabelDisplay="on" name="numberOfResults"/>
                        <label htmlFor="">עומק</label>
                        <Slider defaultValue={statement.results?.deep || 1} min={1} max={4} aria-label="Default" valueLabelDisplay="on" name="deep"/>
                    </form>
                    <div className={styles.results}>
                        {results.length > 0 ? results.map(result => <Text key={result.statementId} text={result.statement} />) : <h2>לא נבחרו עדיין אפשרויות</h2>}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Document;

async function getResults(statement: Statement, subStatements: Statement[], resultsBy: ResultsBy = ResultsBy.topOptions, numberOfResults:number, deep:number): Promise<Statement[]> {
    try {


        switch (resultsBy) {
            case ResultsBy.topOne:

            case ResultsBy.topVote:
                return getResultsByVotes(statement, subStatements);
            case ResultsBy.topOptions:
                return getResultsByOptions(statement, subStatements, numberOfResults);
            default:
                return []
        }
    } catch (error) {
        console.error(error);
        return []
    }
}



async function getResultsByVotes(statement: Statement, subStatements: Statement[]): Promise<Statement[]> {
    try {
        const { selections } = statement;
        if (!selections) return [];
        const maxVoteKey = maxKeyInObject(selections)
        const maxVoteStatement: Statement | undefined = subStatements.find(subStatement => subStatement.statementId === maxVoteKey);
        if (!maxVoteStatement) throw new Error('No statement found with max vote key');


        if (statement.results?.deep && statement.results?.deep > 1) {
            //get top results from sub statement
            const topStatements = await getResultsFromDB({ statement: maxVoteStatement, resultsBy: ResultsBy.topVote, deep: 2 });
            return topStatements
        }

        return [maxVoteStatement];


    } catch (error) {
        console.error(error);
        return []
    }
}

async function getResultsByOptions(statement: Statement, subStatements: Statement[], numberOfResults): Promise<Statement[]> {
    try {
        const maxOptions = subStatements.sort((b, a) => a.consensus - b.consensus)
            .slice(0,numberOfResults || 1);

        return maxOptions;


    }
    catch (error) {
        console.error(error);
        return []
    }
}