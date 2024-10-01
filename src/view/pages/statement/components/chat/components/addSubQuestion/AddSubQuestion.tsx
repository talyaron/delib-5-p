import React, { FC } from "react";

// Third party
import { Statement } from "delib-npm";

// Icons
import AddQuestionIcon from "@/assets/icons/addQuestion.svg?react";
import { useLanguage } from "@/controllers/hooks/useLanguages";

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
				<button className="clickable" onClick={handleShwQuestionModal}>
					{t(text)}
				</button>
			)}
			<button className="clickable" onClick={handleShwQuestionModal}>
				<AddQuestionIcon
					style={{ height: "24px", width: "24px", color: "#4E88C7" }}
				/>
			</button>
		</>
	);
};

export default AddSubQuestion;
