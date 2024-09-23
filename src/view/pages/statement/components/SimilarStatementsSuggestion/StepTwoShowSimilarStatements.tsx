import React from 'react';
import SendIcon from '@/assets/icons/send-icon-pointing-up-and-right.svg?react';
import SubmitStatementButton from './SubmitStatementButton';
import similarEyeIcon from '@/assets/icons/similarEyeIcon.svg';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface SimilarStatementsSuggestionProps {
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	newStatementInput: { title: string; description: string };
	setViewSimilarStatement: React.Dispatch<
		React.SetStateAction<{
			title: string;
			description: string;
		}>
	>;
	similarStatements: { title: string; description: string }[];
}

export default function StepTwoShowSimilarStatements({
	setCurrentStep,
	setShowModal,
	similarStatements,
}: SimilarStatementsSuggestionProps) {
	const { t } = useLanguage();
	const handleViewSimilarStatement = (statement:DisplayStatement) => {
		const anchor = document.getElementById(statement.statementId);
	
		if(anchor) anchor.scrollIntoView({behavior: 'smooth'});
	
		setShowModal(false)
	};

	const handleSubmit = () => {
		setCurrentStep((prev) => prev + 2);
	};

	return (
		<>
			<h1 className="similarities__title">
				{t("Similar suggestions")}
			</h1>
			<h4 className="alertText">
				{t("Here are several results that were found in the following topic")}:
			</h4>
			<section className="similarities__suggestions">
				{similarStatements.map((statement, index) => (
					<button
						key={index}
						className="suggestion"
						onClick={() => handleViewSimilarStatement(statement)}
					>
						<p className="suggestion__title">
							{statement.title}
						</p>
						<p className="suggestion__description">
							{statement.description}
						</p>


						<hr />
					</button>
				))}
				<div className="similarities__buttonBox">
	  <Button text={t("Back")} onClick={() => setCurrentStep(0)} buttonType={ButtonType.SECONDARY}/>
					<Button
						icon={<SendIcon />}
						text={t("Continue with your original suggestion")}
						onClick={handleSubmit}
					/>
        
				</div>
			</section>

      
		</>
	);
}

