import { FC } from "react"

// Third party Imports
import { StatementType, Results as _Results } from "delib-npm"

// Styles
import styles from "./mainCard.module.scss"

// MUI
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import SubResults from "./SubResults"
import { ResultsNode } from "./resultsNode/ResultsNode"

interface Props {
    results: _Results
    level?: number
    resultsType: StatementType[]
}

const MainCard: FC<Props> = ({ results, resultsType }) => {
    const hasSubs = results.sub && results.sub.length > 0

    return (
        <div className={styles.results}>
            <Accordion defaultExpanded={true}>
                {hasSubs ? (
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <ResultsNode
                            statement={results.top}
                            resultsType={resultsType}
                        />
                    </AccordionSummary>
                ) : (
                    <ResultsNode
                        statement={results.top}
                        resultsType={resultsType}
                    />
                )}
                {hasSubs ? (
                    <AccordionDetails>
                        {results.sub?.map((subResult) => {
                            return (
                                <SubResults
                                    key={subResult.top.statementId}
                                    results={subResult}
                                    level={2}
                                    resultsType={resultsType}
                                />
                            )
                        })}
                    </AccordionDetails>
                ) : null}
            </Accordion>
        </div>
    )
}

export default MainCard
