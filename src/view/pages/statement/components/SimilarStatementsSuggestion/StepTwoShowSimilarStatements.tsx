import React, { useState } from 'react';
import SendIcon from '../../../../../assets/icons/send-icon-pointing-up-and-right.svg?react';

interface SimilarStatementsSuggestionProps {
	nextStep: () => void;
}

export default function StepTwoShowSimilarStatements({
	nextStep,
}: SimilarStatementsSuggestionProps) {
	const [similarStatements, setSimilarStatements] = useState<
		{
			title: string;
			description: string;
		}[]
	>([
		{
			title: 'Statement 1',
			description:
				'lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum vel, ultricies nunc. Nullam',
		},
		{
			title: 'Statement 2',
			description:
				'lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum vel, ultricies nunc. Nullam',
		},
		{
			title: 'Statement 3',
			description:
				'lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum vel, ultricies nunc. Nullamlorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum vel, ultricies nunc. Nullams',
		},
	]);

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
			<section className='similarities__statementsBox'>
				{similarStatements.map((statement, index) => (
					<div key={index} className='similarities__statementsBox__similarStatement'>
						<h4>{statement.title}</h4>
						<p>{statement.description}</p>
					</div>
				))}
			</section>
			

			<button className='similarities__submitBox' onClick={handleSubmit}>
				<p>Continue with your statement</p>
				<div>
					<SendIcon style={{ color: 'white' }} />
				</div>
			</button>
		</>
	);
}
