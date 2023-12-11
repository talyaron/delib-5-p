import { useState, FC } from "react";

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

interface Props {
    statement: Statement;
}

const Document: FC<Props> = ({ statement }) => {
    const subStatements = useAppSelector(
        statementsChildSelector(statement.statementId)
    );

    const topResult = sortStatementsByHirarrchy([
        statement,
        ...subStatements.filter((state) => state.statementType !== "statement"),
    ])[0];

    const [results, setResults] = useState<Results>(topResult);

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

    return (
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
    );
};

export default Document;
