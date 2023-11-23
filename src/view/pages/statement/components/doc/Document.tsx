import { useState, FC, useEffect } from "react"

// Third party imports
import { Results, ResultsBy, Statement, StatementType } from "delib-npm"

// Styles
import styles from "./Document.module.scss"

// Custom Components
import Slider from "@mui/material/Slider"
import { getResults } from "./documentCont"
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut"
import { t } from "i18next"
import MainCard from "../../../main/mainCard/MainCard"
import { FilterType, filterByStatementType } from "../../../main/mainCont"
import { getStatementDepth } from "../../../../../functions/db/statements/getStatement"
import { useAppDispatch } from "../../../../../functions/hooks/reduxHooks"
import { setStatement } from "../../../../../model/statements/statementsSlice"

interface Props {
    statement: Statement
    subStatements: Statement[]
}

const Document: FC<Props> = ({ statement, subStatements }) => {
    const dispatch = useAppDispatch()

    const [resultsBy, setResultsBy] = useState<ResultsBy>(
        statement.resultsSettings?.resultsBy || ResultsBy.topOptions
    )
    const [numberOfResults, setNumberOfResults] = useState<number>(
        statement.resultsSettings?.numberOfResults || 2
    )
    const [results, setResults] = useState<Results>({ top: statement })

    function setStatementCB(statement: Statement) {
        dispatch(setStatement(statement))
    }

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
            const depth = Number(data.get("depth"))
            console.log(depth)
            if (!statement) throw new Error("statement is undefined")

            getStatementDepth(statement, depth)
            // const _resultsBy = data.get("results") as ResultsBy
            // const numberOfResults = Number(data.get("numberOfResults"))

            // setResultsBy(_resultsBy)

            // updateResultsSettings(
            //     statement.statementId,
            //     _resultsBy,
            //     numberOfResults
            // )

            // const _results = await getResults(
            //     statement,
            //     subStatements,
            //     _resultsBy,
            //     numberOfResults
            // )
            // // setResults(top);

            // setResults(_results)
        } catch (error) {
            console.error(error)
        }
    }
    const resultsType: StatementType[] = filterByStatementType(
        FilterType.questionsResultsOptions
    ).types

    return (
        <ScreenFadeInOut>
            <div className="wrapper">
                <section className={styles.resultsWrapper}>
                    <h2>{t("Discussion Results")}</h2>
                    <form onSubmit={handleGetResults}>
                        <div className={styles.inputWrapper}>
                            <div>
                                <label htmlFor="resultsId">
                                    {t("Display Results According To")}
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
                                        {t("Maximum Options")}
                                    </option>
                                    <option value={ResultsBy.topVote}>
                                        {t("Votes")}
                                    </option>
                                </select>
                            </div>
                            {resultsBy === ResultsBy.topOptions && (
                                <div>
                                    <label htmlFor="numberOfResults">
                                        {
                                            (t(
                                                "Number of Solutions in Each Level:"
                                            ),
                                            numberOfResults)
                                        }
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
                            )}
                            <section>
                                <label>{t("Depth")}</label>
                                <br />
                                <Slider
                                    aria-label="Small steps"
                                    defaultValue={1}
                                    step={1}
                                    marks
                                    min={1}
                                    max={5}
                                    valueLabelDisplay="on"
                                    name="depth"
                                />
                            </section>
                        </div>

                        <div className="btns">
                            <button type="submit">
                                {t("Display Results")}
                            </button>
                        </div>
                    </form>
                    {results.sub ? (
                        <MainCard results={results} resultsType={resultsType} />
                    ) : (
                        <h2>{t("No Options Selected Yet")}</h2>
                    )}
                </section>
            </div>
        </ScreenFadeInOut>
    )
}

export default Document
