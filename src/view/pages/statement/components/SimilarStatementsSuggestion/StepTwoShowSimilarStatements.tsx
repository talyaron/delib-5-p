import React from "react";
import SendIcon from "@/assets/icons/send-icon-pointing-up-and-right.svg?react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import Button, { ButtonType } from "@/view/components/buttons/button/Button";
import { Statement } from "delib-npm";

interface SimilarStatementsSuggestionProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  newStatementInput: { title: string; description: string };
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  const handleViewSimilarStatement = (statement:Statement) => {
	const anchor = document.getElementById(statement.statementId);
	console.log(anchor);
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
      {/* <div className='similarities__titleInput activeTitle'>
				<label
					htmlFor='titleInput'
				>{t("Title")}</label>
				<input
					type='text'
					id='titleInput'
					className={newStatementInput.title ? 'active' : ''}
					placeholder={t('Suggestion title. What people would see at first sight') }
					value={newStatementInput.title}
					disabled
				/>
			</div> */}
      <h4 className="alertText">
        {t("Here are several results that were found in the following topic")}:
      </h4>
      <section className="similarities__suggestions">
        {similarStatements.map((statement, index) => (
          <div
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
          </div>
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
