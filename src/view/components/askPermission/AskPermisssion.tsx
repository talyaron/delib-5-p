import { FC } from "react";
import Modal from "../modal/Modal";
import notifications from "../../../assets/images/notifications.png";
import styles from "./AskPermisssion.module.scss";
import { useLanguage } from "../../../functions/hooks/useLanguages";

interface Props {
    showFn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AskPermisssion: FC<Props> = ({ showFn }) => {
    const { languageData } = useLanguage();

    return (
        <Modal>
            <div className={styles.notifications}>
                <h2>{languageData["So you can communicate"]}</h2>
                <p>
                    {languageData["It is necessary to receive notifications"]}
                </p>
                <p> {languageData["Please confirm alerts for Delib"]}</p>
                <img
                    src={notifications}
                    alt={languageData["Explain how to open the notifications"]}
                />
                <div className="btns">
                    <button
                        className="btn btn--cancel"
                        onClick={() => showFn(false)}
                    >
                        {languageData["Close"]}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AskPermisssion;
