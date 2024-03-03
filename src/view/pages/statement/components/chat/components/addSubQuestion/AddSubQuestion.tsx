import React, { FC } from "react";

// Third party
import { Statement } from "delib-npm";

// Icons
import addQuestion from "../../../../../../../assets/icons/addQuestion.svg";
import { useLanguage } from "../../../../../../../functions/hooks/useLanguages";

// Styles

interface Props {
    statement: Statement;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    text?: string;
}

const AddSubQuestion: FC<Props> = ({ setShowModal, text }) => {
    const { t } = useLanguage();

    function handleShwQuestionModal() {
        setShowModal(true);
    }

    return (
        <>
            {text && (
                <span className="clickable" onClick={handleShwQuestionModal}>
                    {text}
                </span>
            )}
            <div className="clickable" onClick={handleShwQuestionModal}>
                <img src={addQuestion} alt={t("Add question")} />
            </div>
        </>
    );
};

export default AddSubQuestion;
