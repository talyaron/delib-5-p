import React from "react";
import { Statement } from "delib-npm";

export default function ResultsRange({
    statement,
}: {
    statement: Statement | undefined;
}) {
    const [numOfResults, setNumOfResults] = React.useState(
        statement?.resultsSettings?.numberOfResults || 1,
    );

    return (
        <section className="settings__rangeSection">
            <label
                className="settings__rangeSection__label"
                style={{ fontSize: "1.3rem", marginBottom: "1rem" }}
            >
                {("Number of Results to Display")}
                {": "}
            </label>
            <div className="settings__rangeSection__rangeBox">
                <input
                    className="settings__rangeSection__rangeBox__range"
                    type="range"
                    name="numberOfResults"
                    value={numOfResults}
                    min="1"
                    max="10"
                    onChange={(e) => setNumOfResults(Number(e.target.value))}
                />
                <span style={{ fontSize: 20 }}>{numOfResults}</span>
            </div>
        </section>
    );
}
