import { FC } from "react";

// icons
import AddIcon from "../../../assets/icons/plusIcon.svg?react";

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
            data-cy="add-statement"
        >
            <AddIcon />
        </div>
    );
};

export default Fav;
