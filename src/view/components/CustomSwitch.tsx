// CustomSwitch.js
import React, { useState } from "react";
import "./style.css";

const CustomSwitch = () => {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        // <div className="customSwitch">
        //     <div
        //         className={`switch ${checked ? "on" : "off"}`}
        //         onClick={handleChange}
        //     >
        //         <div className="slider"></div>
        //     </div>
        //     <label>{checked ? "On" : "Off"}</label>
        // </div>
        <div className="switch-container">
            <label htmlFor="toggleSwitch">Toggle Switch</label>
            <input
                type="checkbox"
                id="toggleSwitch"
                className="switch-input"
                checked={checked}
                onChange={handleChange}
            />
            <div className={`switch ${checked ? "on" : "off"}`} />
        </div>
    );
};

export default CustomSwitch;
