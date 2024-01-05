import { FC } from "react";

// Third party
import { Statement } from "delib-npm";
import { t } from "i18next";


// Icons
import addQuestion from "../../../../../../../assets/icons/addQuestion.svg";

// Styles


interface Props {
    statement: Statement;
    setShowModal: Function;
    text?: string;
}

const AddSubQuestion: FC<Props> = ({ setShowModal, text}) => { 
    
   
    function handleShwQuestionModal() {
        setShowModal(true);
    }
    return (
        <>
        {text&&<span className="clickable" onClick={handleShwQuestionModal}>{text}</span>}
            <div className="clickable" onClick={handleShwQuestionModal}>

               <img src={addQuestion} alt={t("Add question")} />
            </div>
            {/* {showQuestionModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatement={statement}
                        isOption={false}
                        setShowModal={setAddQuestionModal}
                    />
                </Modal>
            )} */}
        </>
    );
};

export default AddSubQuestion;
