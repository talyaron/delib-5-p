import "./enableNotifications.scss";
import BellWithDots from "../icons/BellWithDots";
import Modal from "../modal/Modal";

interface Props {
    setAskNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EnableNotifications({ setAskNotifications }: Props) {
    return (
        <Modal>
            <div className="enableNotifications">
                <BellWithDots />
                <p className="enableNotifications__title">Don'T Miss Out!</p>
                <p className="enableNotifications__text">
                    Enable push notifications to stay updated on messages
                </p>
                <div className="enableNotifications__btnBox">
                    <button
                        onClick={() => setAskNotifications(false)}
                        className="enableNotifications__btnBox__cancel"
                    >
                        Not now
                    </button>
                    <button className="enableNotifications__btnBox__enable">
                        Enable notifications
                    </button>
                </div>
            </div>
        </Modal>
    );
}
