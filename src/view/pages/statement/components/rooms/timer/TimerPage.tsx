import React, { useState } from "react";

// Images
import timerImage from "../../../../../../assets/images/timer.png";

// Style
import "./timerPage.scss";
import { t } from "i18next";
import Timer from "../../../../../components/icons/Timer";

export default function TimerPage() {
    const [tab, setTab] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60 * 90);

    const timer = () =>
        setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

    const startTimer = () => {
        timer();
    };

    return (
        <div className="page__main">
            <div className="roomsWrapper">
                <div className="roomsWrapper__nav">
                    <div
                        className="roomsWrapper__nav__options"
                        onClick={() => setTab(0)}
                    >
                        <p
                            className={
                                "roomsWrapper__nav__options__option" +
                                (tab === 0 ? " active" : "")
                            }
                        >
                            {t("Definition")}
                            {tab === 0 && <div className="block" />}
                        </p>
                    </div>
                    <div
                        className="roomsWrapper__nav__options"
                        onClick={() => setTab(1)}
                    >
                        <p
                            className={
                                "roomsWrapper__nav__options__option" +
                                (tab === 1 ? " active" : "")
                            }
                        >
                            {t("Discussion")}
                            {tab === 1 && <div className="block" />}
                        </p>
                    </div>
                    <div
                        className="roomsWrapper__nav__options"
                        onClick={() => setTab(2)}
                    >
                        <p
                            className={
                                "roomsWrapper__nav__options__option" +
                                (tab === 2 ? " active" : "")
                            }
                        >
                            {t("Discussion")}
                            {tab === 2 && <div className="block" />}
                        </p>
                    </div>
                </div>
                <div className="roomsWrapper__timerImg">
                    <h1 className="roomsWrapper__timerImg__title">
                        Discussion
                    </h1>
                    <img src={timerImage} alt="Sand-timer-image" />
                </div>
                <div className="roomsWrapper__timer" onClick={startTimer}>
                    <Timer />
                    <p className="roomsWrapper__timer__time">{timeLeft}</p>
                </div>
            </div>
        </div>
    );
}
