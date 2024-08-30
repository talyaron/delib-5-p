import { Dispatch, FC } from 'react';

// Third party imports
import { useNavigate, useParams } from 'react-router-dom';
import { Role, Statement, StatementSubscription } from 'delib-npm';

// Firestore functions

// Custom components
import UploadImage from '@/view/components/uploadImage/UploadImage';
import DisplayResultsBy from './../../components/displayResultsBy/DisplayResultsBy';
import ResultsRange from './../../components/resultsRange/ResultsRange';
import GetVoters from './../../components/GetVoters';
import GetEvaluators from './../../components/GetEvaluators';
import SubScreensToDisplay from '../tabsToDisplaySwitches/SubScreensToDisplay';

// Hooks & Helpers
import { handleSetStatement } from './../../statementSettingsCont';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import TitleAndDescription from './../../components/titleAndDescription/TitleAndDescription';
import AdvancedSettings from './../../components/advancedSettings/AdvancedSettings';
import MembersSettings from './../../components/membership/MembersSettings';
import SectionTitle from './../../components/sectionTitle/SectionTitle';
import './StatementSettingsForm.scss';

// icons
import SaveIcon from '@/assets/icons/save.svg?react';
import QuestionSettings from '../QuestionSettings/QuestionSettings';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/model/store';

interface StatementSettingsFormProps {
	setIsLoading: (isLoading: boolean) => void;
	statement: Statement;
	parentStatement?: Statement | 'top';
	setStatementToEdit: Dispatch<Statement>;
}

const StatementSettingsForm: FC<StatementSettingsFormProps> = ({
	setIsLoading,
	statement,
	parentStatement,
	setStatementToEdit,
}) => {
	try {
		// * Hooks * //
		const navigate = useNavigate();
		const { statementId } = useParams();
		const { t } = useLanguage();

		// Selector to get the statement memberships
		const statementMembershipSelector = (statementId: string | undefined) =>
			createSelector(
				(state: RootState) => state.statements.statementMembership,
				(memberships) =>
					memberships.filter(
						(membership: StatementSubscription) =>
							membership.statementId === statementId
					)
			);

		const members: StatementSubscription[] = useAppSelector(
			statementMembershipSelector(statementId)
		);

		const joinedMembers = members.filter((member) => member.role !== Role.banned).map(m => m.user);


		// * Functions * //
		const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setIsLoading(true);

			await handleSetStatement({
				navigate,
				statementId,
				statement,
				parentStatement,
			});

			setIsLoading(false);
		};

		const isNewStatement = !statementId;

		const statementSettingsProps = {
			statement,
			setStatementToEdit,
		} as const;

		return (
			<form
				onSubmit={handleSubmit}
				className='statement-settings-form'
				data-cy='statement-settings-form'
			>
				<TitleAndDescription
					statement={statement}
					setStatementToEdit={setStatementToEdit}
				/>
				<SectionTitle title={t('General Settings')} />
				<section className='switches-area'>
					<SubScreensToDisplay {...statementSettingsProps} />
					<AdvancedSettings {...statementSettingsProps} />
				</section>
				<DisplayResultsBy {...statementSettingsProps} />
				<ResultsRange {...statementSettingsProps} />

				{!isNewStatement && (
					<>
						<UploadImage {...statementSettingsProps} />
						<QuestionSettings {...statementSettingsProps} />
						<SectionTitle title={t('Members')} />
						<MembersSettings setStatementToEdit={setStatementToEdit} statement={statement} />
						<section className='get-members-area'>
							<GetVoters statementId={statementId!} joinedMembers={joinedMembers} />
						</section>
						<section className='get-members-area'>
							<GetEvaluators statementId={statementId!} />
						</section>
					</>
				)}

				<button
					type='submit'
					className='submit-button'
					aria-label="Submit button"
					data-cy='settings-statement-submit-btn'
				>
					<SaveIcon />
				</button>
			</form>
		);
	} catch (error) {
		console.error(error);

		return null;
	}
};

export default StatementSettingsForm;
