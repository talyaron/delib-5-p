import { Results as _Results } from 'delib-npm'
import { FC } from 'react';
import styles from './Results.module.scss';
import Text from '../../../../../components/text/Text';

interface Props {
    results: _Results;
    level?: number;
}

const Results: FC<Props> = ({ results }) => {
    return (
        <div className={styles.results}>
            <h2><Text text={results.top.statement} /></h2>
            {results.sub?.map((subResult) => <SubResults key={subResult.top.statementId} results={subResult} level={2} />)}

        </div>
    )
}

function SubResults({ results, level = 2}: Props): JSX.Element {
    const _level:string = `level__${level ||2}`;
    return (
        <div >
            <div className={styles[_level]}><Text text={results.top.statement}/></div>
            {results.sub?.map((subResult) => <SubResults key={subResult.top.statementId} results={subResult} level={level+1}/>)}
        </div>
    )
}


export default Results