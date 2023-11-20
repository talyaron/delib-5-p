import { Results as _Results } from 'delib-npm'
import { FC } from 'react';
import styles from './mainCard.module.scss';
import Text from '../../../components/text/Text';
import { Link } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatementChatMore from '../../statement/components/StatementChatMore';
import Solutions from '../../../components/solutions/Solutions';


interface Props {
    results: _Results;
    level?: number;
}

const MainCard: FC<Props> = ({ results }) => {
  
    const description = results.top.statement.split('\n').slice(1).join('\n');

    if (results.sub && results.sub.length > 0) return (
        <div className={styles.results}>
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Link to={`/home/statement/${results.top.statementId}`}>
                        <h2>  <Text text={results.top.statement} onlyTitle={true} /></h2>
                        {description ? <Text text={description} /> : null}
                      
                       <Solutions statement={results.top} />
                       <StatementChatMore statement={results.top} />
                    </Link>
                </AccordionSummary>
                <AccordionDetails>

                    {results.sub?.map((subResult) => <SubResults key={subResult.top.statementId} results={subResult} level={2} />)}

                </AccordionDetails>

            </Accordion>
        </div>
    )
    else return (
        <div className={styles.results}>

            <Link to={`/home/statement/${results.top.statementId}`}>
                <h2>  <Text text={results.top.statement} onlyTitle={true} /></h2>
                {description ? <Text text={description} /> : null}
                <Solutions statement={results.top} />
                <StatementChatMore statement={results.top} />
            </Link>

            {results.sub?.map((subResult) => <SubResults key={subResult.top.statementId} results={subResult} level={2} />)}


        </div>
    )
}

function SubResults({ results, level = 2 }: Props): JSX.Element {
    const _level: string = `level__${level || 2}`;
    const description = results.top.statement.split('\n').slice(1).join('\n');

    if (results.sub && results.sub.length > 0) return (
        <div className={styles[_level]}>
            <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Link to={`/home/statement/${results.top.statementId}`}>
                        <Text text={results.top.statement} />
                        <Solutions statement={results.top} />
                        <StatementChatMore statement={results.top} />
                    </Link>
                </AccordionSummary>
                <AccordionDetails>
                    {results.sub?.map((subResult) => <SubResults key={subResult.top.statementId} results={subResult} level={level + 1} />)}
                </AccordionDetails>
            </Accordion>
        </div>
    )
    else return (
        <div className={styles[_level]}>
            <Link to={`/home/statement/${results.top.statementId}`}>
                <div ><Text text={results.top.statement} onlyTitle={true} /></div>
                {description ? <article><Text text={description} /></article> : null}
                <Solutions statement={results.top} />
                <StatementChatMore statement={results.top} />
            </Link>
            {results.sub?.map((subResult) => <SubResults key={subResult.top.statementId} results={subResult} level={level + 1} />)}
        </div>
    )

}


export default MainCard