import React from "react";
import "./homeMenu.scss";
import disconnectlIcon from "../../../assets/disconnectIcon.svg";

export default function HomeMenu() {

    return (
        <div className="homeMenu">
            <img
                className="homeMenu__icon"
                src={disconnectlIcon}
                alt="disconnect_icon"
            />
            <p className="homeMenu__name">
                Disconnect
            </p>
        </div>
    );
}