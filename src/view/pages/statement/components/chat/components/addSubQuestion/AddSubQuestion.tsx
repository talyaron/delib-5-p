import { Statement } from "delib-npm";
import { FC, useState } from "react";
import NewSetStatementSimple from "../../../set/NewStatementSimple";
import Modal from "../../../../../../components/modal/Modal";
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
            <div onClick={handleShwQuestionModal}>AddSubQuestion</div>
            {showQuestionModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatement={statement}
                        isQuestion={true}
                        setShowModal={setAddQuestionModal}
                    />
                </Modal>
            )}
        </>
    );
};

export default AddSubQuestion;
