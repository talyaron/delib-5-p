import { Statement } from "delib-npm";
import { FC, useState } from "react";
import NewSetStatementSimple from "../../../set/NewStatementSimple";
import Modal from "../../../../../../components/modal/Modal";
import PostAddIcon from "@mui/icons-material/PostAdd";
import styles from "./AddSubQuestion.module.scss";
import { t } from "i18next";

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
                <PostAddIcon sx={{ width: `1.3rem` }} htmlColor="white" />
               
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
