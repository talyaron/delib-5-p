import { FC } from "react";

// icons
// import AddIcon from "@mui/icons-material/Add";
import addIcon from "../../../assets/icons/addIcon.svg";

interface Props {
    onclick: () => void;
}
const Fav: FC<Props> = ({ onclick }) => {
    const position = {
        transform: "translate(-50%, -10%)",
        left: "50%",
        bottom: "6%",
    };

    return (
        <div
            style={position}
            className="homeFav homeFav--fixed"
            onClick={onclick}
        >
            <img src={addIcon} alt="add_icon" />
        </div>
    );
};

export default Fav;
