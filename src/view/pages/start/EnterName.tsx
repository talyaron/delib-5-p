import React, { FC, useState } from "react";

// Third party libs
import { t } from "i18next";

// Styles
import styles from "./enterName.module.scss";

// Custom components
import Modal from "../../components/modal/Modal";

// Functions
import { signAnonymously } from "../../../functions/db/auth";

interface Props {
    setShowNameModul: React.Dispatch<React.SetStateAction<boolean>>;
}

const EnterName: FC<Props> = ({ setShowNameModul }) => {
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [showeStartBtn, setShowStartBtn] = useState<boolean>(false);

    function handleSetName(ev: any) {
        setDisplayName(ev.target.value);
        if (isReadyToStart(ev.target.value)) setShowStartBtn(true);
        else setShowStartBtn(false);
    }

    function handleStart() {
        try {
            if (isReadyToStart(displayName)) {
                signAnonymously();
                const _displayName = displayName || "unonimous";
                localStorage.setItem("displayName", _displayName);
                setShowNameModul(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal>
            <div className={styles.box}>
                <input
                    className={styles.input}
                    onKeyUp={handleSetName}
                    type="text"
                    name="displayName"
                    placeholder={t("Nickname")}
                    autoFocus={true}
                    autoComplete="off"
                />
                <div className="btns">
                    <button
                        onClick={handleStart}
                        className={showeStartBtn ? "btn btn--agree" : "btn btn--inactive"}
                    >
                        {t("Start")}
                    </button>
                    <div
                        className="btn btn--cancel"
                        onClick={() => setShowNameModul(false)}
                    >
                        {t("Cancel")}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EnterName;

function isReadyToStart(displayName: string | null) {
    if (displayName === null) return false;
    if (displayName.length > 2) return true;
    else return false;
}
