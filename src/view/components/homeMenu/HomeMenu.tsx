import { FC } from "react";
import "./homeMenu.scss";
import disconnectlIcon from "../../../assets/icons/disconnectIcon.svg";
import { handleLogout } from "../../../functions/general/helpers";
import { t } from "i18next";

interface Props {
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
const HomeMenu: FC<Props> = ({ setOpenMenu }) => {
    return (
        <>
            <div className="homeMenu">
                <img
                    className="homeMenu__icon"
                    src={disconnectlIcon}
                    alt="disconnect_icon"
                />
                <p className="homeMenu__name" onClick={handleLogout}>
                    {t("Disconnect")}
                </p>
            </div>

            <div
                className="homeMenu__background"
                onClick={() => setOpenMenu(false)}
            ></div>
        </>
    );
};
export default HomeMenu;
