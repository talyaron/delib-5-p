import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import styles from "./mainCard.module.scss"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Results, StatementType } from "delib-npm"
import { ResultsNode } from "./resultsNode/ResultsNode"

interface Props {
    results: Results
    level?: number
    resultsType?: StatementType[]
}

function SubResults({
    results,
    level = 2,
    resultsType = [StatementType.question],
}: Props) {
    const _level: string = `level__${level || 2}`
    
    //filter results by type
    if(!(results.top.statementType && resultsType.includes(results.top.statementType))) return null;

    return (
        <div className={styles[_level]}>
            <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <ResultsNode
                        statement={results.top}
                        resultsType={resultsType}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    {results.sub?.map((subResult) => (
                        <SubResults
                            key={subResult.top.statementId}
                            results={subResult}
                            level={level + 1}
                            resultsType={resultsType}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default SubResults
