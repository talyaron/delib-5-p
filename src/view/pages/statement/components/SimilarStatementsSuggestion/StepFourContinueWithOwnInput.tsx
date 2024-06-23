import React from 'react';
import TwoColorButton from '../../../../components/buttons/TwoColorButton';
import SendIcon from '../../../../../assets/icons/send-icon-pointing-up-and-right.svg?react';

interface StepFourContinueWithOwnInput {
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	newStatementInput: { title: string; description: string };
}

export default function StepFourContinueWithOwnInput({
	setShowModal,
	newStatementInput,
}: StepFourContinueWithOwnInput) {
	const handleSubmit = () => {
		// Submit the user statement

		// Close the modal
		setShowModal(false);
	};

	return (
		<>
			<h4 className='similarities__title'>Your statement details</h4>
			<div className='similarities__titleInput'>
				<label htmlFor='titleInput'>Your statement title</label>
				<input
					type='text'
					id='titleInput'
					placeholder='Statement title. What people would see at first sight.'
					value={newStatementInput.title}
					disabled
				/>
			</div>
			<div className='similarities__titleInput'>
				<label htmlFor='descriptionInput'>Your statement description</label>
				<textarea
					rows={5}
					id='descriptionInput'
					placeholder='Formulate here the statement description. Add as much detail as you can to help others understand your statement.'
					value={newStatementInput.description}
					disabled
				/>
			</div>

			<div className='similarities__buttonBox'>
				<TwoColorButton
					icon={SendIcon}
					text='Submit my Statement'
					textBackgroundColor='#fff'
					textColor='var(--dark-text)'
					iconBackgroundColor='var(--dark-blue)'
					onClick={handleSubmit}
				/>
			</div>
		</>
	);
}
