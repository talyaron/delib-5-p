import "./homeMenu.scss";
import disconnectlIcon from "../../../assets/disconnectIcon.svg";
import { handleLogout } from "../../../functions/general/helpers";

export default function HomeMenu() {

    return (
        <div className="homeMenu">
            <img
                className="homeMenu__icon"
                src={disconnectlIcon}
                alt="disconnect_icon"
            />
            <p className="homeMenu__name" onClick={handleLogout}>
                Disconnect
            </p>
        </div>
    );
}