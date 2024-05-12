import { useState, FC, useEffect } from "react";

// Third party imports
import { Results, Statement } from "delib-npm";

// Custom Components
import ScreenFadeIn from "../../../../components/animation/ScreenFadeIn";
import TreeChart from "./components/TreeChart";
import Modal from "../../../../components/modal/Modal";

// Helpers
import {
    FilterType,
    filterByStatementType,
    sortStatementsByHierarchy,
} from "../../../../../controllers/general/sorting";
import { getChildStatements } from "../../../../../controllers/db/statements/getStatement";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";

// Hooks
import { useLanguage } from "../../../../../controllers/hooks/useLanguages";
import { useMapContext } from "../../../../../controllers/hooks/useMap";
import { ReactFlowProvider } from "reactflow";

interface Props {
    statement: Statement;
}

const StatementMap: FC<Props> = ({ statement }) => {
    const { t } = useLanguage();
    const { mapContext, setMapContext } = useMapContext();

    const [results, setResults] = useState<Results | undefined>();
    const [subStatements, setSubStatements] = useState<Statement[]>([]);

    useEffect(() => {
        getSubStatements();
    }, []);

    const handleFilter = (filterBy: FilterType) => {
        const filteredArray = filterByStatementType(filterBy).types;

        const filterSubStatements = subStatements.filter((state) => {
            if (!state.statementType) return false;

            return filteredArray.includes(state.statementType);
        });

        const sortedResults = sortStatementsByHierarchy([
            statement,
            ...filterSubStatements,
        ]);

        setResults(sortedResults[0]);
    };

    // Get all child statements and set top result to display map
    // In the future refactor to listen to changes in sub statements
    const getSubStatements = async () => {
        const childStatements = await getChildStatements(statement.statementId);

        setSubStatements(childStatements);

        const topResult = sortStatementsByHierarchy([
            statement,
            ...childStatements.filter(
                (state) => state.statementType !== "statement",
            ),
        ])[0];

        setResults(topResult);
    };

    const toggleModal = (show: boolean) => {
        setMapContext((prev) => ({
            ...prev,
            showModal: show,
        }));
    };

    return (
        <ScreenFadeIn className="page__main">
            <ReactFlowProvider>
                <select
                    onChange={(ev) => handleFilter(ev.target.value as FilterType)}
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
                        height: "20vh",
                        width: "100%",
                        direction: "ltr",
                    }}
                >
                    {results && (
                        <TreeChart
                            topResult={results}
                            getSubStatements={getSubStatements}
                        />
                    )}
                </div>

                {mapContext.showModal && (
                    <Modal>
                        <CreateStatementModal
                            parentStatement={mapContext.parentStatement}
                            isOption={mapContext.isOption}
                            setShowModal={toggleModal}
                            getSubStatements={getSubStatements}
                        />
                    </Modal>
                )}
            </ReactFlowProvider>
        </ScreenFadeIn>
    );
};

export default StatementMap;
