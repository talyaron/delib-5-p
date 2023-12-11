import { useState, FC, useEffect } from "react";

// Third party imports
import { Results, Statement } from "delib-npm";
import { t } from "i18next";

// Redux Store
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks";
import { statementsChildSelector } from "../../../../../model/statements/statementsSlice";

// Custom Components
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut";
import StatementMap from "../../../map/StatementMap";

// Helpers
import {
    FilterType,
    filterByStatementType,
    sortStatementsByHirarrchy,
} from "../../../../../functions/general/sorting";
import { getChildStatements } from "../../../../../functions/db/statements/getStatement";

interface Props {
    statement: Statement;
}

const Document: FC<Props> = ({ statement }) => {
    // const subStatements = useAppSelector(
    //     statementsChildSelector(statement.statementId)
    // );

    const [results, setResults] = useState<Results | undefined>();
    const [subStatements, setSubStatements] = useState<Statement[]>([]);

    const handleFilter = (filterBy: FilterType) => {
        const filteredArray = filterByStatementType(filterBy).types;

        const filterSubStatements = subStatements.filter((state) => {
            if (!state.statementType) return false;
            return filteredArray.includes(state.statementType);
        });

        const sortedResults = sortStatementsByHirarrchy([
            statement,
            ...filterSubStatements,
        ]);

        setResults(sortedResults[0]);
    };

    const getSubStatements = async () => {
        const childStatements = await getChildStatements(statement.statementId);

        setSubStatements(childStatements);

        const topResult = sortStatementsByHirarrchy([
            statement,
            ...childStatements.filter(
                (state) => state.statementType !== "statement"
            ),
        ])[0];

        setResults(topResult);
    };

    useEffect(() => {
        getSubStatements();
    }, []);

    return results ? (
        <ScreenFadeInOut className="page__main">
            <select
                onChange={(ev: any) => handleFilter(ev.target.value)}
                defaultValue={FilterType.questionsResultsOptions}
                style={{ width: "50ch", margin: "0 auto" }}
            >
                <option value={FilterType.questionsResults}>
                    {t("Questions and Results")}
                </option>
                <option value={FilterType.questionsResultsOptions}>
                    {t("Questions, options and Results")}
                </option>
                <option value={FilterType.all}>{t("All")}</option>
            </select>
            <div style={{ flex: "auto", height: "10vh", width: "100%" }}>
                <StatementMap topResult={results} />
            </div>
        </ScreenFadeInOut>
    ) : (
        <div>Loading...</div>
    );
};

export default Document;
