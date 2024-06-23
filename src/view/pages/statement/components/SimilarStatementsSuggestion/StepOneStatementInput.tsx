import React, { useState } from 'react';
import SendIcon from '../../../../../assets/icons/send-icon-pointing-up-and-right.svg?react';

interface SimilarStatementsSuggestionProps {
	nextStep: () => void;
}

export default function StepOneStatementInput({
	nextStep,
}: SimilarStatementsSuggestionProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = () => {
		nextStep();
	};

	return (
		<>
			<h4 className='similarities__title'>Compose your question</h4>
			<div className='similarities__titleInput'>
				<label htmlFor='titleInput'>Your statement title</label>
				<input
					type='text'
					id='titleInput'
					placeholder='Statement title. What people would see at first sight.'
				/>
			</div>
			{isLoading ? (
				<div>loading...</div>
			) : (
				<>
					<div className='similarities__titleInput'>
						<label htmlFor='descriptionInput'>Your statement description</label>
						<textarea
							rows={5}
							id='descriptionInput'
							placeholder='Formulate here the statement description. Add as much detail as you can to help others understand your statement.'
						/>
					</div>

					<button className='similarities__submitBox' onClick={handleSubmit}>
						<p>Submit Statement</p>
						<div>
							<SendIcon style={{ color: 'white' }} />
						</div>
					</button>
				</>
			)}
		</>
	);
}
