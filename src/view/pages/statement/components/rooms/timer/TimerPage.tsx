import { useEffect, useState } from "react";

// Images
import timerImage from "../../../../../../assets/images/timer.png";

// Style
import "./timerPage.scss";
import { t } from "i18next";
import Timer from "../../../../../components/icons/Timer";
import PlayIcon from "../../../../../components/icons/PlayIcon";
import PauseIcon from "../../../../../components/icons/PauseIcon";
import StopIcon from "../../../../../components/icons/StopIcon";
import ChevronRightIcon from "../../../../../components/icons/ChevronRightIcon";
import ChevronLeftIcon from "../../../../../components/icons/ChevronLeftIcon";
import { getMinutesAndSeconds } from "./timerPagecont";
import { startTimerDB } from "../../../../../../functions/db/timer/setTimer";
import { Statement } from "delib-npm";
interface Props {
    statement:Statement
}

export default function TimerPage({statement}:Props):JSX.Element {
    // useState
    const [tab, setTab] = useState(0);
    const [initTime] = useState(1000 * 300); // 90 seconds
    const [timeLeft, setTimeLeft] = useState(initTime);
    const [minutes, setMinutes] = useState(
        getMinutesAndSeconds(initTime).minutes,
    );
    const [seconds, setSeconds] = useState(
        getMinutesAndSeconds(initTime).seconds,
    );
    const [isActive, setIsActive] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timer>();

    const percent = (timeLeft / initTime) * 100;

    const interval = () =>
        setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1000;
                if (newTime < 0) {
                    clearInterval(timer);

                    return 0;
                }

                setMinutes(getMinutesAndSeconds(newTime).minutes);
                setSeconds(getMinutesAndSeconds(newTime).seconds);

                return newTime;
            });
        }, 1000);

    useEffect(() => {
        if (isActive) {
            setTimer(interval());
        } else {
            clearInterval(timer);
        }

        return () => {
            clearInterval(interval());
        };
    }, [isActive]);

    const stopAndResetTimer = () => {
        setIsActive(false);
        setTimeLeft(initTime);
        setMinutes(getMinutesAndSeconds(initTime).minutes);
        setSeconds(getMinutesAndSeconds(initTime).seconds);
    };
    const startTimer = ():void => {
        setIsActive(true);

        //send a message to the server that the timer has started
        startTimerDB();
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
                <div className="roomsWrapper__timer">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "2rem",
                        }}
                    >
                        <ChevronRightIcon
                            onClick={() => console.log("Chevron Right clicked")}
                        />
                        <Timer percent={percent} />
                        <ChevronLeftIcon
                            onClick={() => console.log("Chevron Left clicked")}
                        />
                    </div>
                    <p className="roomsWrapper__timer__time">{`${
                        minutes < 10 ? "0" + minutes : minutes
                    }:${seconds < 10 ? "0" + seconds : seconds}`}</p>
                    {!isActive && <PlayIcon onClick={startTimer} />}
                    {isActive && (
                        <div className="roomsWrapper__timer__time__actions">
                            <StopIcon onClick={stopAndResetTimer} />
                            <PauseIcon onClick={() => setIsActive(false)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
