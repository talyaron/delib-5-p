import { FC } from "react";
import "./homeMenu.scss";
import DisconnectIcon from "../../../assets/icons/disconnectIcon.svg?react";
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
    console.log(dir);

    return (
        <>
            <div
                className="homeMenu"
                style={{
                    flexDirection: direction,
                    left: dir === "ltr" ? "-2rem" : "2rem",
                }}
                onClick={() => handleLogout(dispatch)}
            >
                <DisconnectIcon />
                <p className="homeMenu__name">{t("Disconnect")}</p>
            </div>

            <div
                className="homeMenu__background"
                onClick={() => setOpenMenu(false)}
            ></div>
        </>
    );
};
export default HomeMenu;
