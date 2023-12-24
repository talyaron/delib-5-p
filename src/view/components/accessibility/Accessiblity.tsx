import { useEffect, useState } from "react";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks";
import {
    fontSizeSelector,
    increaseFontSize,
    userSelector,
} from "../../../model/users/userSlice";
import { updateUserFontSize } from "../../../functions/db/users/setUsersDB";

// Icons
import AccessiblityIcon from "../icons/AccessiblityIcon";

const Accessiblity = () => {
    const dispatch = useAppDispatch();
    const fontSize = useAppSelector(fontSizeSelector);
    const user = useAppSelector(userSelector);

    const [isOpen, setIsOpen] = useState(false);
    const [_fontSize, setFontSize] = useState(fontSize || 14);

    useEffect(() => {
        document.documentElement.style.fontSize = fontSize + "px";
        document.body.style.fontSize = fontSize + "px";
    }, [fontSize]);

    function handleChangeFontSize(number: number) {
        if (!user) {
            //get curent font size from body

            //update body font size
            document.documentElement.style.fontSize = `${_fontSize + number}px`;
            setFontSize(_fontSize + number);
        } else {
            updateUserFontSize(fontSize + number);
            dispatch(increaseFontSize(number));
        }
    }

    function handleOpen() {
        if (isOpen) {
            // If it's not open, open it and start the timer to close it after 2 seconds
            setIsOpen(false);
        } else {
            // If it's already open, close it immediately
            setIsOpen(true);
            setTimeout(() => {
                setIsOpen(false);
            }, 14000);
        }
    }

    return (
        <div
            className="accessibility"
            style={!isOpen ? { left: "-12.6rem" } : { left: "0rem" }}
        >
            <div className="accessibility__button" onClick={handleOpen}>
                =
                <AccessiblityIcon />
            </div>
            <div className="accessibility__fonts">
                <div
                    className="accessibility__fonts__control"
                    onClick={() => handleChangeFontSize(1)}
                >
                    +
                </div>
                <div className="accessibility__fonts__size">
                    {user ? fontSize : _fontSize}px
                </div>
                <div
                    className="accessibility__fonts__control"
                    onClick={() => handleChangeFontSize(-1)}
                >
                    -
                </div>
                <span dir="ltr">Fonts:</span>
            </div>
        </div>
    );
};

export default Accessiblity;
