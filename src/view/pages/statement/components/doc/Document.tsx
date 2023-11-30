import { useState, FC, useEffect } from "react";

// Third party imports
import {
    Results,
    ResultsBy,
    Statement,
    StatementSchema,
    StatementType,
} from "delib-npm";

// Styles
import styles from "./Document.module.scss";

// Custom Components
import Slider from "@mui/material/Slider";
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut";
import { t } from "i18next";
import MainCard from "../../../main/mainCard/MainCard";
import {
    FilterType,
    filterByStatementType,
    sortStatementsByHirarrchy,
} from "../../../main/mainCont";
import {
    getChildStatements,
    getStatementDepth,
} from "../../../../../functions/db/statements/getStatement";
import {
    setStatement,
    setStatements,
    statementsChildSelector,
} from "../../../../../model/statements/statementsSlice";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../functions/hooks/reduxHooks";

interface Props {
    statement: Statement;
}

const Document: FC<Props> = ({ statement }) => {
    const dispatch = useAppDispatch();

    const subStatements = useAppSelector(
        statementsChildSelector(statement.statementId)
    );
    console.log(subStatements.length);

    const [resultsBy, setResultsBy] = useState<ResultsBy>(
        statement.resultsSettings?.resultsBy || ResultsBy.topOptions
    );
    const [activateRender, setActivateRender] = useState<number>(0);
    const [numberOfResults, setNumberOfResults] = useState<number>(
        statement.resultsSettings?.numberOfResults || 2
    );

    const _results = sortStatementsByHirarrchy([statement, ...subStatements]);

    const [results, setResults] = useState<Results>(_results[0]);

    useEffect(() => {
        console.log(subStatements);
        const _results = sortStatementsByHirarrchy([
            statement,
            ...subStatements,
        ]);
        setResults(_results[0]);
    }, [activateRender]);

    async function handleGetResults(ev: any) {
        try {
            //get form data with formData
            ev.preventDefault();

            if (!statement) throw new Error("statement is undefined");

            const childStatements = await getChildStatements(
                statement.statementId
            );
            console.log(childStatements);

            dispatch(setStatements(childStatements));
            const _results = sortStatementsByHirarrchy([
                statement,
                ...childStatements,
            ]);
            setResults(_results[0]);
        } catch (error) {
            console.error(error);
        }
    }
    const resultsType: StatementType[] = filterByStatementType(
        FilterType.questionsResultsOptions
    ).types;

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

                    <MainCard results={results} resultsType={resultsType} />
                </section>
            </div>
        </ScreenFadeInOut>
    );
};

export default Document;
