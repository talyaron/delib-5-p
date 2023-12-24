import { FC } from "react";
import PlusIcon from "../icons/PlusIcon";

interface Props {
    onclick?: Function;
    isHome: boolean;
}
const Fav: FC<Props> = ({ onclick, isHome }) => {
    const position = {
        right: isHome ? "20vw" : "1rem",
        bottom: isHome ? "5vh" : "3rem",
    };

    return (
        <div
            style={position}
            className="fav fav--fixed"
            onClick={(ev) => (onclick ? onclick(ev) : null)}
        >
            <div>
                <PlusIcon color="white" />
            </div>
        </div>
    );
};

export default Fav;
