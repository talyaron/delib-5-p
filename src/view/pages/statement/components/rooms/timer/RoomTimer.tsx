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
import SetTimerComp from "../admin/setTimers/setTimer/SetTimerComp";


interface Props {
    statement: Statement;
    roomNumber: number;
    roomTimer: RoomTimer;
    activeTimer: boolean;
    nextTimer: () => void;
    autoStart?: boolean;
    lastTimer?: boolean;
}

export default function Timer({
    statement,
    roomNumber,
    roomTimer,
    activeTimer,
    nextTimer,
    autoStart,
    lastTimer,
}: Props): JSX.Element {
    const userId = store.getState().user.user?.uid;
    const title = roomTimer.title;

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
    const [timer, setTimer] = useState<NodeJS.Timer>();
    const isMasterTimer =
    roomTimer?.initiatorId === userId || roomTimer.state === TimerStatus.finish;

    const percent = (timeLeft / initTime) * 100;

    const interval = () =>
        setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1000;
                if (newTime < 0) {
                    setIsActive(false);
                    initilizeTimer();
                    nextTimer();
                    clearInterval(timer);
                    if (lastTimer) updateTimerState(TimerStatus.finish);

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

    useEffect(() => {
        if (autoStart && activeTimer) {
            setTimeout(() => {
                startTimer();
            }, 1000);
        }
    }, [activeTimer]);

    useEffect(() => {
        if (
            roomTimer?.state === TimerStatus.start &&
            !isActive &&
            roomTimer?.activeTimer === timerId &&
            !isMasterTimer
        ) {
            console.log(
                `start timer ${timerId} - Active: ${roomTimer?.activeTimer} - Master: ${isMasterTimer}`,
            );
            startTimer();
        } else if (roomTimer?.state === TimerStatus.pause) {
            pauseTimer();
        } else if (roomTimer?.state === TimerStatus.finish) {
            stopAndResetTimer();
        }
    }, [roomTimer?.state]);

    // useEffect(() => {
    //     if (roomTimer?.timers) {
    //         //@ts-ignore
    //         const newTime = getInitTime(timers, timerId)
           

          
    //         if (newTime !== undefined) {
    //             setInitTime(newTime);
    //             setTimeLeft(newTime);
    //             setMinutes(getMinutesAndSeconds(newTime).minutes);
    //             setSeconds(getMinutesAndSeconds(newTime).seconds);
    //         }
    //     }
    // }, [timers?.timers]);

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
                    <SetTimerComp
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
