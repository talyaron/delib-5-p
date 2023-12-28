import { FC, useState } from "react";

// Third party
import { Statement } from "delib-npm";
import { t } from "i18next";

// Custom components
import NewSetStatementSimple from "../../../set/NewStatementSimple";
import Modal from "../../../../../../components/modal/Modal";

// Icons
import AddStatementIcon from "../../../../../../components/icons/AddStatementIcon";

// Styles
import styles from "./AddSubQuestion.module.scss";

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
            <div className={styles.box} onClick={handleShwQuestionModal}>
                <span>{t("Add Question")}</span>
                <AddStatementIcon />
            </div>
            {showQuestionModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentData={statement}
                        isQuestion={true}
                        setShowModal={setAddQuestionModal}
                    />
                </Modal>
            )}
        </>
    );
};

export default AddSubQuestion;
