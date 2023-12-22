import { FC } from "react";

import { FaPlus } from "react-icons/fa6";

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
                <FaPlus
                    color="white"
                    size="1.5rem"
                    style={{
                        transform: "translateX(.8rem) translateY(.8rem) ",
                    }}
                />
            </div>
        </div>
    );
};

export default Fav;
