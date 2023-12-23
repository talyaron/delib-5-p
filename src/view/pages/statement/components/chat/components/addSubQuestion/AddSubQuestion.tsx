import { FC, useState } from "react";

// Third party
import { Statement } from "delib-npm";
import { t } from "i18next";

// Custom components
import NewSetStatementSimple from "../../../set/NewStatementSimple";
import Modal from "../../../../../../components/modal/Modal";

// Icons
import { MdOutlinePostAdd } from "react-icons/md";

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
                <MdOutlinePostAdd color="white" size="1.5rem" />
            </div>
            {showQuestionModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatementId={statement.statementId}
                        isQuestion={true}
                        setShowModal={setAddQuestionModal}
                    />
                </Modal>
            )}
        </>
    );
};

export default AddSubQuestion;
