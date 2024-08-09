// custom components
import Checkbox from '@/view/components/checkbox/Checkbox';

// HELPERS
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { FC } from 'react';
import { StatementSettingsProps } from '../../settingsTypeHelpers';
import { getStatementSettings } from '../../statementSettingsCont';
import './AdvancedSettings.scss';

const AdvancedSettings: FC<StatementSettingsProps> = ({
	statement,
	setStatementToEdit,
}) => {
	const { t } = useLanguage();

	const hasChildren = statement.hasChildren ?? true;

	const statementSettings = getStatementSettings(statement);
	const {
		inVotingGetOnlyResults,
		enhancedEvaluation,
		showEvaluation,
		enableAddVotingOption,
		enableAddEvaluationOption,
		enableSimilaritiesSearch,
		enableNavigationalElements,
	} = statementSettings;

	const setStatementSetting = (
		key: keyof typeof statementSettings,
		newValue: boolean
	) => {
		setStatementToEdit({
			...statement,
			statementSettings: {
				...statementSettings,
				[key]: newValue,
			},
		});
	};

	return (
		<div className='advanced-settings'>
			<h3 className='title'>{t('Advanced')}</h3>
			<Checkbox
				label={'Enable Sub-Conversations'}
				isChecked={hasChildren}
				toggleSelection={() => {
					setStatementToEdit({
						...statement,
						hasChildren: !hasChildren,
					});
				}}
			/>
			<Checkbox
				label={'Enhanced Evaluation'}
				isChecked={enhancedEvaluation}
				toggleSelection={() => {
					setStatementSetting('enhancedEvaluation', !enhancedEvaluation);
				}}
			/>
			<Checkbox
				label={'Show Evaluations results'}
				isChecked={showEvaluation}
				toggleSelection={() => {
					setStatementSetting('showEvaluation', !showEvaluation);
				}}
			/>
			<Checkbox
				label={'Allow participants to contribute options to the voting page'}
				isChecked={enableAddVotingOption}
				toggleSelection={() => {
					setStatementSetting('enableAddVotingOption', !enableAddVotingOption);
				}}
			/>
			<Checkbox
				label='Allow participants to contribute options to the evaluation page'
				isChecked={enableAddEvaluationOption}
				toggleSelection={() => {
					setStatementSetting(
						'enableAddEvaluationOption',
						!enableAddEvaluationOption
					);
				}}
			/>
			<Checkbox
				label='In Voting page, show only the results of the top options'
				isChecked={inVotingGetOnlyResults}
				toggleSelection={() => {
					setStatementSetting(
						'inVotingGetOnlyResults',
						!inVotingGetOnlyResults
					);
				}}
			/>
			<Checkbox
				label='Allow similarity search'
				isChecked={enableSimilaritiesSearch}
				toggleSelection={() => {
					setStatementSetting(
						'enableSimilaritiesSearch',
						!enableSimilaritiesSearch
					);
				}}
			/>
						<Checkbox
				label='Allow removal of navigational elements'
				isChecked={enableNavigationalElements}
				toggleSelection={() => {
					setStatementSetting(
						'enableNavigationalElements',
						!enableNavigationalElements
					);
				}}
			/>
		</div>
	);
};

export default AdvancedSettings;
