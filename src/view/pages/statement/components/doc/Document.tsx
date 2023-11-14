import { Results, ResultsBy, Statement } from "delib-npm"
import { useState, FC, useEffect } from "react"

import styles from "./Document.module.scss"
import { updateResultsSettings } from "../../../../../functions/db/results/setResults"

import { maxKeyInObject } from "../../../../../functions/general/helpers"
import { getResultsDB } from "../../../../../functions/db/results/getResults"
import Slider from "@mui/material/Slider"
import ResultsComp from "./results/Results"

interface Props {
    statement: Statement
    subStatements: Statement[]
}

const Document: FC<Props> = ({ statement, subStatements }) => {
    const [resultsBy, setResultsBy] = useState<ResultsBy>(
        statement.results?.resultsBy || ResultsBy.topOptions
    )
    const [numberOfResults, setNumberOfResults] = useState<number>(
        statement.results?.numberOfResults || 2
    )
    const [results, setResults] = useState<Results>({ top: statement })

    useEffect(() => {
        if (!subStatements) return

        ;(async () => {
            const _results = await getResults(
                statement,
                subStatements,
                resultsBy,
                numberOfResults
            )

            setResults(_results)
        })()
    }, [subStatements])

    async function handleGetResults(ev: any) {
        try {
            //get form data with formData
            ev.preventDefault()

            const data = new FormData(ev.target)
            const _resultsBy = data.get("results") as ResultsBy
            console.log(_resultsBy)
            const numberOfResults = Number(data.get("numberOfResults"))

            setResultsBy(_resultsBy)

            updateResultsSettings(
                statement.statementId,
                _resultsBy,
                numberOfResults
            )

            const _results = await getResults(
                statement,
                subStatements,
                _resultsBy,
                numberOfResults
            )
            // setResults(top);

            setResults(_results)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="page__main">
            <div className="wrapper">
                <section className={styles.resultsWrapper}>
                    <h2>תוצאות הדיון</h2>
                    <form onSubmit={handleGetResults}>
                        <div className={styles.inputWrapper}>
                            <div>
                                <label htmlFor="resultsId">
                                    הצגת תוצאות לפי
                                </label>
                                <select
                                    name="results"
                                    defaultValue={resultsBy}
                                    id="resultsId"
                                    onChange={(ev: any) =>
                                        setResultsBy(ev.target.value)
                                    }
                                >
                                    <option value={ResultsBy.topOptions}>
                                        אופציות מקסימליות
                                    </option>
                                    <option value={ResultsBy.topVote}>
                                        הצבעות
                                    </option>
                                </select>
                            </div>
                            {resultsBy === ResultsBy.topOptions ? (
                                <div>
                                    <label htmlFor="numberOfResults">
                                        כמות פתרונות בכל רמה: {numberOfResults}
                                    </label>
                                    <Slider
                                        defaultValue={numberOfResults || 2}
                                        min={1}
                                        max={10}
                                        aria-label="Default"
                                        valueLabelDisplay="on"
                                        name="numberOfResults"
                                        id="numberOfResults"
                                        onChange={(ev: any) =>
                                            setNumberOfResults(
                                                Number(ev.target.value)
                                            )
                                        }
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div className="btns">
                            <button type="submit">הצגת תוצאות</button>
                        </div>
                    </form>
                    {results.sub ? (
                        <ResultsComp results={results} />
                    ) : (
                        <h2>לא נבחרו עדיין אפשרויות</h2>
                    )}
                </section>
            </div>
        </div>
    )
}

export default Document

async function getResults(
    statement: Statement,
    subStatements: Statement[],
    resultsBy: ResultsBy,
    numberOfResults: number
): Promise<Results> {
    try {
        // const { results } = statement;

        console.log("resultsBy", resultsBy, "numberOfResults", numberOfResults)

        const result: Results = { top: statement }

        switch (resultsBy) {
            case ResultsBy.topOne:
            case ResultsBy.topVote:
                result.sub = [...getResultsByVotes(statement, subStatements)]
                break
            case ResultsBy.topOption:
                result.sub = [
                    ...getResultsByOptions(subStatements, numberOfResults),
                ]
                break
            default:
                result.sub = []
        }

        const subResultsPromises = result.sub.map(
            async (subResult: Results) => {
                const subStatement = subResult.top
                const subResults: Statement[] = await getResultsDB(subStatement)
                console.log(
                    `subResults ${subResult.top.statement}:`,
                    subResults
                )
                return subResults
            }
        )

        const resultsStatements = await Promise.all(subResultsPromises)

        result.sub.forEach((_: Results, index: number) => {
            if (!result.sub) return
            result.sub[index].sub = [
                ...resultsStatements[index].map((subStatement: Statement) => ({
                    top: subStatement,
                })),
            ]
        })

        return result
    } catch (error) {
        console.error(error)
        return { top: statement }
    }
}

function getResultsByVotes(
    statement: Statement,
    subStatements: Statement[]
): Results[] {
    try {
        const maxVoteKey = getTopVoteStatementId(statement)
        if (!maxVoteKey) return []
        const maxVoteStatement: Statement | undefined = subStatements.find(
            (subStatement) => subStatement.statementId === maxVoteKey
        )
        if (!maxVoteStatement) return []
        const result: Results = { top: maxVoteStatement }

        return [result]
    } catch (error) {
        console.error(error)
        return []
    }
}

function getResultsByOptions(
    subStatements: Statement[],
    numberOfResults: number
): Results[] {
    try {
        console.log(subStatements)
        console.log(numberOfResults)
        const maxOptions: Statement[] = subStatements
            .filter((s) => s.isOption)
            .sort((b, a) => a.consensus - b.consensus)
            .slice(0, numberOfResults || 1)

        const _maxOptions = maxOptions.map((topStatement: Statement) => ({
            top: topStatement,
            sub: [],
        }))

        return _maxOptions
    } catch (error) {
        console.error(error)
        return []
    }
}

function getTopVoteStatementId(statement: Statement): string | undefined {
    try {
        const { selections } = statement
        if (!selections) return undefined

        const maxVoteKey = maxKeyInObject(selections)
        return maxVoteKey
    } catch (error) {
        console.error(error)
        return undefined
    }
}
