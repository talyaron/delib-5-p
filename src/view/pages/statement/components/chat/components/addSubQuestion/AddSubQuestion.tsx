import { FC, useState } from "react";

// Third party
import { Statement } from "delib-npm";
import { t } from "i18next";

// Custom components
import NewSetStatementSimple from "../../../set/NewStatementSimple";
import Modal from "../../../../../../components/modal/Modal";

// Icons
import addQuestion from "../../../../../../../assets/icons/addQuestion.svg";

// Styles


interface Props {
    statement: Statement;
}

const AddSubQuestion: FC<Props> = ({ statement }) => {
    const [showQuestionModal, setAddQuestionModal] = useState(false);
    function handleShwQuestionModal() {
        setAddQuestionModal(true);
    }
    return (
        <>
            <div className="clickable" onClick={handleShwQuestionModal}>

               <img src={addQuestion} alt={t("Add question")} />
            </div>
            {showQuestionModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatement={statement}
                        isOption={false}
                        setShowModal={setAddQuestionModal}
                    />
                </Modal>
            )}
        </>
    );
};

export default AddSubQuestion;
