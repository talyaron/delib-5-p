import { FC } from "react";
import "./homeMenu.scss";
import disconnectlIcon from "../../../assets/icons/disconnectIcon.svg";
import { handleLogout } from "../../../functions/general/helpers";
import useDirection from "../../../functions/hooks/useDirection";
import { useLanguage } from "../../../functions/hooks/useLanguages";
import { useDispatch } from "react-redux";

interface Props {
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
const HomeMenu: FC<Props> = ({ setOpenMenu }) => {
    const direction = useDirection();
    const { t, dir } = useLanguage();
    const dispatch = useDispatch();

    return (
        <>
            <div
                className="homeMenu"
                style={{ flexDirection: direction }}
                onClick={() => handleLogout(dispatch)}
            >
                <img
                    className="homeMenu__icon"
                    src={disconnectlIcon}
                    alt="disconnect_icon"
                />
                <p className="homeMenu__name" style={{right:dir === "rtl"?"2rem":'none'}}>{t("Disconnect")}</p>
            </div>

            <div
                className="homeMenu__background"
                onClick={() => setOpenMenu(false)}
            ></div>
        </>
    );
};
export default HomeMenu;
