import React, { FC } from "react";
import { useLanguage } from "../../../../../../../functions/hooks/useLanguages";
import { WithStatement } from "../../settingsTypeHelpers";
import "./ResultsRange.scss";

const ResultsRange: FC<WithStatement> = ({ statement }) => {
    const { t } = useLanguage();
    const defaultNumOfResults =
        statement?.resultsSettings?.numberOfResults || 1;

    const [numOfResults, setNumOfResults] = React.useState(defaultNumOfResults);

    const title = `${t("Number of Results to Display")}: `;

    return (
        <section className="results-range">
            <div className="title">{title}</div>
            <div className="range-box">
                <input
                    className="range"
                    type="range"
                    name="numberOfResults"
                    value={numOfResults}
                    min="1"
                    max="10"
                    onChange={(e) => setNumOfResults(Number(e.target.value))}
                />
                <span className="number-of-results">{numOfResults}</span>
            </div>
        </section>
    );
};

export default ResultsRange;
