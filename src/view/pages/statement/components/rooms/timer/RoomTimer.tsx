import { useEffect, useState } from "react";

// Style
import "./timerPage.scss";

import TimerIcon from "./timerIcon/TimerIcon";
import PlayIcon from "../../../../../components/icons/PlayIcon";
import PauseIcon from "../../../../../components/icons/PauseIcon";
import StopIcon from "../../../../../components/icons/StopIcon";
import { getMinutesAndSeconds } from "./timerPagecont";
import { RoomTimer, TimerStatus } from "delib-npm";
import { store } from "../../../../../../model/store";
import SetRoomTimerComp from "./setTimer/SetRoomTimerComp";
import { setTimersStatusDB } from "../../../../../../functions/db/timer/setTimer";

interface Props {
    roomTimer: RoomTimer;
    isActiveTimer: boolean;
}

export default function Timer({
    roomTimer,
    isActiveTimer,
}: Props): JSX.Element {
    const userId = store.getState().user.user?.uid;

    // useState
    const [initTime, setInitTime] = useState<number>(roomTimer.time); //timers?.timers[timerId as keyof typeof timers.timers].initTime as number
    const [timeLeft, setTimeLeft] = useState(roomTimer.time);
    const [timerAdjustment, setTimerAdjustment] = useState<boolean>(false);
    const [minutes, setMinutes] = useState(
        getMinutesAndSeconds(roomTimer.time).minutes,
    );
    const [seconds, setSeconds] = useState(
        getMinutesAndSeconds(roomTimer.time).seconds,
    );
    const [isActive, setIsActive] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timer>();

    const percent = (timeLeft / initTime) * 100;

    const interval = () =>
        setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1000;
                if (newTime < 0) {
                    setIsActive(false);
                    initilizeTimer();
                    clearInterval(timer);
                    setTimersStatusDB(roomTimer, TimerStatus.finish);
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
    const startTimer = (): void => {
        setIsActive(true);

        //send a message to the server that the timer has started
    };

    const pauseTimer = () => {
        setIsActive(false);
    };

    function initilizeTimer() {
        setMinutes(getMinutesAndSeconds(initTime).minutes);
        setSeconds(getMinutesAndSeconds(initTime).seconds);
        setTimeLeft(initTime);
    }

    return (
        <div className="roomsWrapper">
            <div className="roomsWrapper__timer">
                <h2>{roomTimer.title}</h2>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                    }}
                >
                    <TimerIcon percent={percent} />
                </div>
                {timerAdjustment ? (
                    <SetRoomTimerComp
                        roomTimer={roomTimer}
                        setTimerAdjustment={setTimerAdjustment}
                        setInitTime={setInitTime}
                    />
                ) : (
                    <p
                        className="roomsWrapper__timer__time"
                        onClick={() => setTimerAdjustment(true)}
                    >{`${minutes < 10 ? "0" + minutes : minutes}:${
                        seconds < 10 ? "0" + seconds : seconds
                    }`}</p>
                )}
                <div style={{ opacity: isActiveTimer ? "1" : "0.2" }}>
                    {!isActive && (
                        <PlayIcon
                            onClick={() => {
                                if (isActiveTimer) {
                                    startTimer();
                                    setTimersStatusDB(
                                        roomTimer,
                                        TimerStatus.start,
                                    );
                                }
                            }}
                        />
                    )}

                    {isActive && (
                        <div className="roomsWrapper__timer__time__actions">
                            <StopIcon
                                onClick={() => {
                                    if (isActiveTimer) {
                                        stopAndResetTimer();
                                        setTimersStatusDB(
                                            roomTimer,
                                            TimerStatus.finish,
                                        );
                                    }
                                }}
                            />
                            <PauseIcon
                                onClick={() => {
                                    if (isActiveTimer) {
                                        pauseTimer();
                                        setTimersStatusDB(
                                            roomTimer,
                                            TimerStatus.pause,
                                        );
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
