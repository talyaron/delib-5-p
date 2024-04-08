import { useState } from "react";

// Custom components

// Third party imports
import { Statement, ResultsBy } from "delib-npm";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";
import RadioBox from "../../../../../components/radioBox/RadioBox";

export default function DisplayResultsBy({
    statement,
}: {
    statement: Statement | undefined;
}) {
    const { t } = useLanguage();

    const resultsBy = (): string => {
        if (!statement) return ResultsBy.topOptions;

        return statement.resultsSettings?.resultsBy || ResultsBy.topOptions;
    };

    const [currentValue, setCurrentValue] = useState(resultsBy());

    return (
        <section className="settings__resultsBy">
            <h3 className="settings__resultsBy__title">{t("Results By")}</h3>
            <RadioBox
                currentValue={currentValue}
                setCurrentValue={setCurrentValue}
                radioValue={ResultsBy.topOptions}
            >
                <label htmlFor="favoriteOption">{t("Favorite Option")}</label>
            </RadioBox>
            <RadioBox
                currentValue={currentValue}
                setCurrentValue={setCurrentValue}
                radioValue={ResultsBy.topVote}
            >
                <label htmlFor="votingResults">{t("Voting Results")}</label>
            </RadioBox>
        </section>
    );
}
