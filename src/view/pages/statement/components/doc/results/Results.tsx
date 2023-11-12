import { Results as _Results } from 'delib-npm'
import { FC } from 'react';
import styles from './Results.module.scss';
import Text from '../../../../../components/text/Text';

interface Props {
    results: _Results;
    level?: number;
}

const Results: FC<Props> = ({ results }) => {
const description = results.top.statement.split('\n').slice(1).join('\n');

    return (
        <div className={styles.results}>
            <h2><Text text={results.top.statement} onlyTitle={true} /></h2>
            {description?<Text text={description} />:null}
            {results.sub?<h3>תוצאות</h3>:null}
            {results.sub?.map((subResult) => <SubResults key={subResult.top.statementId} results={subResult} level={2} />)}

        </div>
    )
}

function SubResults({ results, level = 2}: Props): JSX.Element {
    const _level:string = `level__${level ||2}`;
    const description = results.top.statement.split('\n').slice(1).join('\n');

    return (
        <div className={styles[_level]}>
            <div ><Text text={results.top.statement} onlyTitle={true}/></div>
            {description?<article><Text text={description} /></article>:null}
            {results.sub?.map((subResult) => <SubResults key={subResult.top.statementId} results={subResult} level={level+1}/>)}
        </div>
    )
}


export default Results