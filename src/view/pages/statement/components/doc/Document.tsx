import { useState, FC, useEffect } from "react";

// Third party imports
import { Results, Statement } from "delib-npm";
import { t } from "i18next";


// Custom Components
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut";
import StatementMap from "./map/StatementMap";

// Helpers
import {
    FilterType,
    filterByStatementType,
    sortStatementsByHirarrchy,
} from "../../../../../functions/general/sorting";
import { getChildStatements } from "../../../../../functions/db/statements/getStatement";
import { SuspenseFallback } from "../../../../../router";
import { useMyContext } from "../../../../../functions/hooks/useMap";
import Modal from "../../../../components/modal/Modal";
import NewSetStatementSimple from "../set/NewStatementSimple";

interface Props {
    statement: Statement;
}

const Document: FC<Props> = ({ statement }) => {
    // const subStatements = useAppSelector(
    //     statementsChildSelector(statement.statementId)
    // );
    const { showModal, setShowModal, parentId, isOption, isQuestion } =
        useMyContext();

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

    // Get all child statements and set top result to display map
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
                style={{
                    width: "100vw",
                    maxWidth: "300px",
                    margin: "1rem auto",
                    position: "absolute",
                    right: "1rem",
                    zIndex: 100,
                }}
            >
                <option value={FilterType.questionsResults}>
                    {t("Questions and Results")}
                </option>
                <option value={FilterType.questionsResultsOptions}>
                    {t("Questions, options and Results")}
                </option>
            </select>
            <div
                style={{
                    flex: "auto",
                    height: "10vh",
                    width: "100%",
                    direction: "ltr",
                }}
            >
                <StatementMap topResult={results} />
            </div>

            {showModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatementId={parentId}
                        isOption={isOption}
                        isQuestion={isQuestion}
                        setShowModal={setShowModal}
                        getSubStatements={getSubStatements}
                    />
                </Modal>
            )}
        </ScreenFadeInOut>
    ) : (
        <SuspenseFallback />
    );
};

export default Document;
