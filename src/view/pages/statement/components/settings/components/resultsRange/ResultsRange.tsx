import { FC } from "react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { StatementSettingsProps } from "../../settingsTypeHelpers";
import { defaultResultsSettings } from "../../emptyStatementModel";
import "./ResultsRange.scss";

const ResultsRange: FC<StatementSettingsProps> = ({
	statement,
	setStatementToEdit,
}) => {
	const { t } = useLanguage();
	const resultsSettings = statement.resultsSettings ?? defaultResultsSettings;

	const title = `${t("Number of Results to Display")}: `;

	return (
		<section className="results-range">
			<div className="title">{title}</div>
			<div className="range-box">
				<input
					className="range"
					type="range"
					aria-label="Number Of Results"
					name="numberOfResults"
					value={resultsSettings.numberOfResults}
					min="1"
					max="10"
					onChange={(e) => {
						setStatementToEdit({
							...statement,
							resultsSettings: {
								...resultsSettings,
								numberOfResults: Number(e.target.value),
							},
						});
					}}
				/>
				<span className="number-of-results">
					{resultsSettings.numberOfResults}
				</span>
			</div>
		</section>
	);
};

export default ResultsRange;
