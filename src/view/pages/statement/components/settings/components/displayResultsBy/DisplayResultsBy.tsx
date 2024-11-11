import { FC, useState } from 'react';

// Custom components

// Third party imports
import { ResultsBy } from 'delib-npm';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import RadioButtonWithLabel from '@/view/components/radioButtonWithLabel/RadioButtonWithLabel';
import './DisplayResultsBy.scss';
import { StatementSettingsProps } from '../../settingsTypeHelpers';
import { defaultResultsSettings } from '../../emptyStatementModel';

const DisplayResultsBy: FC<StatementSettingsProps> = ({
	statement,
	setStatementToEdit,
}) => {
	const { t } = useLanguage();
	const resultsSettings = statement.resultsSettings ?? defaultResultsSettings;

	const [selectedOption, setSelectedOption] = useState(
		resultsSettings.resultsBy
	);

	const toggleSelection = (option: ResultsBy) => {
		setSelectedOption(option);
		setStatementToEdit({
			...statement,
			resultsSettings: {
				...resultsSettings,
				resultsBy: option,
			},
		});
	};

	return (
		<section className="display-results-by">
			<h3 className="title">{t('Results By')}</h3>
			<RadioButtonWithLabel
				id={t('Favorite Option')}
				labelText={t('Favorite Option')}
				checked={selectedOption === ResultsBy.topOptions}
				onChange={() => toggleSelection(ResultsBy.topOptions)}
			/>
			{/* <RadioButtonWithLabel
                id="favoriteOption"
                labelText={t("Voting Results")}
                checked={selectedOption === ResultsBy.topVote}
                onChange={() => toggleSelection(ResultsBy.topVote)}
            /> */}
		</section>
	);
};

export default DisplayResultsBy;
