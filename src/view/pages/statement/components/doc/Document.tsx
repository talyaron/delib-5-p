import { ResultsBy, Statement } from 'delib-npm';
import { useState, FC } from 'react';
import Text from '../../../../components/text/Text';
import styles from './Document.module.scss';
import { updateResults } from '../../../../../functions/db/results/setResults';

import { maxKeyInObject } from '../../../../../functions/general/helpers';
import { getResultsFromDB,getResultsByTopVote } from '../../../../../functions/db/results/getResults';
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
            // const numberOfResults = Number(data.get('numberOfResults'));
            // const deep = Number(data.get('deep'));


            setResultsBy(resultsBy)

            updateResults(statement.statementId, resultsBy);

            const top = await getResults(statement, subStatements, resultsBy);
            // setResults(top);
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
                        <Slider defaultValue={statement.results?.numberOfResults || 1} min={1} max={10} aria-label="Default" valueLabelDisplay="on" name="numberOfResults" />
                        <label htmlFor="">עומק</label>
                        <Slider defaultValue={statement.results?.deep || 1} min={1} max={4} aria-label="Default" valueLabelDisplay="on" name="deep" />
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

interface Results2 {
    top: Statement;
    sub: Statement[];
}

interface Results1 {
    top: Statement;
    sub?: Results2[];
}
interface ResultsTop {
    top: Statement;
    sub: Results1[];
}

async function getResults(statement: Statement, subStatements: Statement[], resultsBy: ResultsBy = ResultsBy.topOptions): Promise<ResultsTop[]> {
    try {


        switch (resultsBy) {
            case ResultsBy.topOne:

            case ResultsBy.topVote:
                return getResultsByVotes(statement, subStatements);
            case ResultsBy.topOptions:
                return [];
            // return getResultsByOptions(statement, subStatements, numberOfResults);
            default:
                return []
        }
    } catch (error) {
        console.error(error);
        return []
    }
}






async function getResultsByVotes(statement: Statement, subStatements: Statement[]): Promise<ResultsTop[]> {
    try {
        const { selections } = statement;
        const { results } = statement;
        let deep = results?.deep || 1;
        const resultsBy = results?.resultsBy || ResultsBy.topOptions;

        if (!selections) return [];
        const maxVoteKey = maxKeyInObject(selections)
        const maxVoteStatement: Statement | undefined = subStatements.find(subStatement => subStatement.statementId === maxVoteKey);
        if (!maxVoteStatement) throw new Error('No statement found with max vote key');
        const resultStatements: ResultsTop = { top: maxVoteStatement, sub: [] };
        console.log('resultStatements', resultStatements);
        console.log(deep)
        if (deep > 0) {
           
            //get top results from sub statement
            const topStatements = await getResultsFromDB({ statement: maxVoteStatement, resultsBy, deep });
            if (topStatements.length === 0) return [resultStatements];

            const results1: Results1[] = topStatements.map((topStatement: Statement) => ({ top: topStatement, sub: [] }))
            resultStatements.sub = [...results1];
            deep--;
            console.log(resultStatements)
            //get top results from sub statements
            const topStatment1:Statement = resultStatements.sub[0].top;
            const topStatement1 = await getResultsByTopVote(topStatment1)
            console.log(topStatement1)
            resultStatements.sub[0].sub = topStatement1.map((topStatement: Statement) => ({ top: topStatement, sub: [] }));

        }
console.log([resultStatements])

        return [resultStatements];


    } catch (error) {
        console.error(error);
        return []
    }
}

// async function getResultsByOptions(statement: Statement, subStatements: Statement[], numberOfResults:number): Promise<Statement[]> {
//     try {
//         console.log( statement.statementId);
//         const maxOptions = subStatements.sort((b, a) => a.consensus - b.consensus)
//             .slice(0, numberOfResults || 1);

//         return maxOptions;


//     }
//     catch (error) {
//         console.error(error);
//         return []
//     }
// }