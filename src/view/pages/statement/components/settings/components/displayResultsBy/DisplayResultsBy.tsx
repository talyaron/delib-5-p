import { FC, useState } from "react";

// Custom components

// Third party imports
import { ResultsBy } from "delib-npm";
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";
import RadioButtonWithLabel from "../../../../../../components/radioButtonWithLabel/RadioButtonWithLabel";
import "./DisplayResultsBy.scss";
import { WithStatement } from "../../settingsTypeHelpers";

const DisplayResultsBy: FC<WithStatement> = ({ statement }) => {
    const { t } = useLanguage();

    const getDefaultSelectedOption = () =>
        statement?.resultsSettings?.resultsBy ?? ResultsBy.topOptions;

    const [selectedOption, setSelectedOption] = useState(
        getDefaultSelectedOption(),
    );

    return (
        <section className="display-results-by">
            <h3 className="title">{t("Results By")}</h3>
            <RadioButtonWithLabel
                id="favoriteOption"
                labelText={t("Favorite Option")}
                checked={selectedOption === ResultsBy.topOptions}
                onChange={() => {
                    setSelectedOption(ResultsBy.topOptions);
                }}
                value={ResultsBy.topOptions}
            />
            {/* <RadioButtonWithLabel
                id="favoriteOption"
                value={ResultsBy.topVote}
                labelText={t("Voting Results")}
                checked={selectedOption === ResultsBy.topVote}
                onChange={() => {
                    setSelectedOption(ResultsBy.topVote);
                }}
            /> */}
        </section>
    );
};

export default DisplayResultsBy;
