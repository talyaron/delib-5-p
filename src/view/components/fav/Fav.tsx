import { FC } from "react";

import AddIcon from "@mui/icons-material/Add";

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
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <AddIcon
                    style={{ transform: `translateX(0rem) scale(1.45)` }}
                />
            </div>
        </div>
    );
};

export default Fav;
