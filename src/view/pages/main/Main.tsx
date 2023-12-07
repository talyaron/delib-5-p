import React, { useState } from "react";

// Third party libraries
import { useNavigate } from "react-router-dom";
import { Results, StatementType } from "delib-npm";
import { t } from "i18next";

// Custom components
import Fav from "../../components/fav/Fav";
import MainCard from "./mainCard/MainCard";

// Firestore functions
import { FilterType, filterByStatementType } from "./mainCont";

// Other
import useSortStatements from "../../../functions/hooks/useSortStatements";
import ScreenSlide from "../../components/animation/ScreenSlide";

const Main = () => {
    // Hooks
    const navigate = useNavigate();
    const results = useSortStatements();

    // Use State
    const [filterState, setFilter] = useState<FilterType>(FilterType.all);

    function handleAddStatment() {
        navigate("/home/addStatment", {
            state: { from: window.location.pathname },
        });
    }

    const resultsType = filterByStatementType(filterState)
        .types as StatementType[];

    return (
        <ScreenSlide className="page__main" toSubStatement={true}>
            <div className="wrapper">
                <h2>{t("Conversations")}</h2>
                <label>{t("Show")}</label>
                <select onChange={(ev: any) => setFilter(ev.target.value)}>
                    <option value={FilterType.all}>{t("All")}</option>
                    <option value={FilterType.questions}>
                        {t("Questions")}
                    </option>
                    <option value={FilterType.questionsResults}>
                        {t("Questions and Results")}
                    </option>
                    <option value={FilterType.questionsResultsOptions}>
                        {t("Questions, options and Results")}
                    </option>
                </select>
                {results.map((result: Results) => (
                    <MainCard
                        key={result.top.statementId}
                        results={result}
                        resultsType={resultsType}
                    />
                ))}
            </div>
            <Fav isHome={true} onclick={handleAddStatment} />
        </ScreenSlide>
    );
};

export default React.memo(Main);
