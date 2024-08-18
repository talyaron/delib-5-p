import SendIcon from '@/assets/icons/send-icon-pointing-up-and-right.svg?react';
import SubmitStatementButton from './SubmitStatementButton';

interface StepFourContinueWithOwnInput {
	newStatementInput: { title: string; description: string };
	onFormSubmit: () => void;
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function StepFourContinueWithOwnInput({
	newStatementInput,
	onFormSubmit,
}: Readonly<StepFourContinueWithOwnInput>) {
	return (
		<>
			<h4 className='similarities__title'>Your statement details</h4>
			<div className='similarities__titleInput'>
				<label htmlFor='titleInput'>Your statement title</label>
				<input
					type='text'
					id='titleInput'
					value={newStatementInput.title}
					disabled
				/>
			</div>
			<div className='similarities__titleInput'>
				<label htmlFor='descriptionInput'>Your statement description</label>
				<textarea
					rows={5}
					id='descriptionInput'
					value={newStatementInput.description}
					disabled
					placeholder={
						newStatementInput.description ? '' : 'No description provided'
					}
				/>
			</div>
			<div className='twoButtonBox'>
				<SubmitStatementButton
					icon={SendIcon}
					text='Submit my Statement'
					buttonMaxWidth="11.5rem"
					textColor='var(--white)'
					onClick={onFormSubmit}
				/>
			</div>
		</>
	);
}
