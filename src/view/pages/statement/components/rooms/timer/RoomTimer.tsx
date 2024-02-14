import { useEffect, useState } from "react";

// Style
import "./timerPage.scss";

import TimerIcon from "./timerIcon/TimerIcon";
import PlayIcon from "../../../../../components/icons/PlayIcon";
import PauseIcon from "../../../../../components/icons/PauseIcon";
import StopIcon from "../../../../../components/icons/StopIcon";
import { getMinutesAndSeconds } from "./timerPagecont";
import { RoomTimer, Statement, TimerStatus } from "delib-npm";
import { setTimersStateDB } from "../../../../../../functions/db/timer/setTimer";
import { store } from "../../../../../../model/store";
import SetTimer from "./setTimer/SetRoomTimerComp";

interface Props {
    statement: Statement;
    roomTimer: RoomTimer;
    activeTimer: boolean;
    nextTimer: () => void;
    autoStart?: boolean;
    lastTimer?: boolean;
}

export default function RoomTimerComp({
    statement,
    roomTimer,
    activeTimer,
    nextTimer,
    autoStart,
    lastTimer,
}: Props): JSX.Element {
    const userId = store.getState().user.user?.uid;

    // useState
    const [initTime, setInitTime] = useState<number>(roomTimer.time);
    const [timeLeft, setTimeLeft] = useState(roomTimer.time);
    const [timerAdjustment, setTimerAdjustment] = useState<boolean>(false);
    const [minutes, setMinutes] = useState(
        getMinutesAndSeconds(roomTimer.time).minutes,
    );
    const [seconds, setSeconds] = useState(
        getMinutesAndSeconds(roomTimer.time).seconds,
    );
    const [isActive, setIsActive] = useState(false);
    console.log(roomTimer);
    const [timer, setTimer] = useState<RoomTimer>(roomTimer);
    const isMasterTimer =
        timer?.initiatorId === userId || timer?.state === TimerStatus.finish;

    const percent = (timeLeft / initTime) * 100;

    const interval = () => {
        const int = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1000;
                if (newTime < 0) {
                    setIsActive(false);
                    initilizeTimer();
                    nextTimer();
                    clearInterval(int);
                    if (lastTimer) updateTimerState(TimerStatus.finish);

                    return 0;
                }

                setMinutes(getMinutesAndSeconds(newTime).minutes);
                setSeconds(getMinutesAndSeconds(newTime).seconds);

                return newTime;
            });
        }, 1000);
        return int;
    };

    // useEffect(() => {
    //     // if (isActive) {
    //     //     setTimer(interval());
    //     // } else {
    //     //     clearInterval(timer);
    //     // }

    //     return () => {
    //         clearInterval(interval());
    //     };
    // }, [isActive]);

    useEffect(() => {
        if (autoStart && activeTimer) {
            setTimeout(() => {
                startTimer();
            }, 1000);
        }
    }, [activeTimer]);

    useEffect(() => {
        if (
            _timer?.state === TimerStatus.start &&
            !isActive &&
            _timer?.activeTimer === timerId &&
            !isMasterTimer
        ) {
            console.log(
                `start timer ${timerId} - Active: ${_timer?.activeTimer} - Master: ${isMasterTimer}`,
            );
            startTimer();
        } else if (_timer?.state === TimerStatus.pause) {
            pauseTimer();
        } else if (_timer?.state === TimerStatus.finish) {
            stopAndResetTimer();
        }
    }, [_timer?.state]);

    // useEffect(() => {
    //     if (_timer?.timers) {
    //         //@ts-ignore
    //         const newTime = getInitTime(timers, timerId)

    //         if (newTime !== undefined) {
    //             setInitTime(newTime);
    //             setTimeLeft(newTime);
    //             setMinutes(getMinutesAndSeconds(newTime).minutes);
    //             setSeconds(getMinutesAndSeconds(newTime).seconds);
    //         }
    //     }
    // }, [_timer?.timers]);

    const stopAndResetTimer = () => {
        setIsActive(false);
        setTimeLeft(initTime);
        setMinutes(getMinutesAndSeconds(initTime).minutes);
        setSeconds(getMinutesAndSeconds(initTime).seconds);

        updateTimerState(TimerStatus.finish);
    };
    const startTimer = (): void => {
        setIsActive(true);

        //send a message to the server that the timer has started
        updateTimerState(TimerStatus.start);
    };

    const pauseTimer = () => {
        setIsActive(false);
        updateTimerState(TimerStatus.pause);
    };

    function initilizeTimer() {
        setMinutes(getMinutesAndSeconds(initTime).minutes);
        setSeconds(getMinutesAndSeconds(initTime).seconds);
        setTimeLeft(initTime);
        updateTimerState(TimerStatus.finish);
    }

    return (
        <div className="roomsWrapper">
            <div className="roomsWrapper__timer">
                <h2>{title}</h2>
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
                    <SetTimer
                        statementId={statement.statementId}
                        roomNumber={roomNumber}
                        timerId={timerId}
                        initTime={initTime}
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
                <div
                    style={{
                        opacity: activeTimer && isMasterTimer ? `1` : `.2`,
                    }}
                >
                    {!isActive && (
                        <PlayIcon
                            onClick={() => {
                                if (activeTimer && isMasterTimer) startTimer();
                            }}
                        />
                    )}
                    {isActive && (
                        <div className="roomsWrapper__timer__time__actions">
                            <StopIcon
                                onClick={() => {
                                    if (activeTimer && isMasterTimer)
                                        stopAndResetTimer();
                                }}
                            />
                            <PauseIcon
                                onClick={() => {
                                    if (activeTimer && isMasterTimer)
                                        pauseTimer();
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    function updateTimerState(newState: TimerStatus) {
        try {
            if (isMasterTimer) {
                setTimersStateDB({
                    statementId: statement.statementId,
                    roomNumber,
                    timerId,
                    state: newState,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function getInitTime(timers: RoomTimer | null, timerId: number): number {
    try {
        if (!timers?.timers) return 1000 * 90;

        //@ts-ignore
        const initTime = timers?.timers[timerId].initTime;

        return initTime;
    } catch (error) {
        console.error(error);

        return 1000 * 90;
    }
}
