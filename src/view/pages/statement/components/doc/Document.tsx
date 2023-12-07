import { useState, FC, useEffect } from "react";

// Third party imports
import { Results, Statement, StatementType } from "delib-npm";

// Styles
import styles from "./Document.module.scss";

// Custom Components
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut";
import { t } from "i18next";
import MainCard from "../../../main/mainCard/MainCard";
import {
    FilterType,
    filterByStatementType,
    sortStatementsByHirarrchy,
} from "../../../../../functions/general/sorting";
import { getChildStatements } from "../../../../../functions/db/statements/getStatement";
import {
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

let results: Results = {};

const Document: FC<Props> = ({ statement }) => {
    const dispatch = useAppDispatch();

    const subStatements = useAppSelector(
        statementsChildSelector(statement.statementId)
    );

    const _results = sortStatementsByHirarrchy([statement, ...subStatements]);

    const [results, setResults] = useState<Results>(_results[0]);
    const [render, setRender] = useState<number>(0);

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
            setRender(render + 1);
            
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

    // useEffect(() => {
    //     console.log(subStatements);
    //     const _results = sortStatementsByHirarrchy([
    //         statement,
    //         ...subStatements,
    //     ]);
    //     setResults(_results[0]);
    // }, [render]);

    return (
        <ScreenFadeInOut className="page__main">
            <div className="wrapper">
                <section className={styles.resultsWrapper}>
                    <h2>{t("Discussion Results")}</h2>
                    <div className="btns">
                        <button onClick={handleGetResults}>
                            {t("Display Results")}
                        </button>
                    </div>
                    <MainCard results={results} resultsType={resultsType} />
                </section>
            </div>
        </ScreenFadeInOut>
    );
};

export default Document;
