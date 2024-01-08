import { FC } from "react";

// icons
// import AddIcon from "@mui/icons-material/Add";
import addIcon from "../../../assets/addIcon.svg";

interface Props {
    onclick?: Function;
    isHome: boolean;
}
const Fav: FC<Props> = ({ onclick, isHome }) => {
    const position = {
        // right: isHome ? "20vw" : "1rem",
        // bottom: isHome ? "5vh" : "3rem",
        transform: isHome ? "translate(-50%, -10%)" : "translate(-50%, -10%)",
        left: isHome ? "50%" : "50%",
        bottom: isHome ? "6%" : "6%",
    };

    return (

        <div
            style={position}
            className="f
            homeFav homeFav--fixed"
            onClick={(ev) => (onclick ? onclick(ev) : null)}
        >
            <img src={addIcon} alt="add_icon" />
        </div>
    );
};

export default Fav;
