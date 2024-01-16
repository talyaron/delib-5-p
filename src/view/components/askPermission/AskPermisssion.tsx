import { FC } from "react";
import Modal from "../modal/Modal";
import notifications from "../../../assets/notifications.png";
import styles from "./AskPermisssion.module.scss";

interface Props {
    showFn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AskPermisssion: FC<Props> = ({ showFn }) => {
    return (
        <Modal>
            <div className={styles.notifications}>
                <h2>{("So you can communicate")}</h2>
                <p>{("It is necessary to receive notifications")}</p>
                <p> {("Please confirm alerts for Delib")}</p>
                <img
                    src={notifications}
                    alt={("Explain how to open the notifications")}
                />
                <div className="btns">
                    <button
                        className="btn btn--cancel"
                        onClick={() => showFn(false)}
                    >
                        {"Close"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AskPermisssion;
