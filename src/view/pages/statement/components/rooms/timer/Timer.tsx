import { useEffect, useState } from "react";

// Style
import "./timerPage.scss";

import TimerIcon from "./timerIcon/TimerIcon";
import PlayIcon from "../../../../../components/icons/PlayIcon";
import PauseIcon from "../../../../../components/icons/PauseIcon";
import StopIcon from "../../../../../components/icons/StopIcon";
import { getMinutesAndSeconds } from "./timerPagecont";
import { Statement, TimerStatus } from "delib-npm";
import { setTimersStateDB } from "../../../../../../functions/db/timer/setTimer";

interface Props {
    statement: Statement;
    roomNumber: number;
    timerId: number;
    title: string;
    activeTimer: boolean;
    nextTimer: Function;
    initTime: number;
    autoStart?: boolean;
    lastTimer?: boolean;
}

export default function Timer({
    statement,
    roomNumber,
    timerId,
    title,
    activeTimer,
    nextTimer,
    initTime,
    autoStart,
    lastTimer
}: Props): JSX.Element {
    // useState
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
                    setIsActive(false);
                    initilizeTimer();
                    nextTimer();
                    clearInterval(timer);
                    setTimersStateDB({
                        statementId: statement.statementId,
                        roomNumber,
                        timerId,
                        state: lastTimer?TimerStatus.finish:TimerStatus.stop,
                    });

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

    const stopAndResetTimer = () => {
        setIsActive(false);
        setTimeLeft(initTime);
        setMinutes(getMinutesAndSeconds(initTime).minutes);
        setSeconds(getMinutesAndSeconds(initTime).seconds);

        setTimersStateDB({
            statementId: statement.statementId,
            roomNumber,
            timerId,
            state: TimerStatus.start,
        });
    };
    const startTimer = (): void => {
        setIsActive(true);

        //send a message to the server that the timer has started
        setTimersStateDB({
            statementId: statement.statementId,
            roomNumber,
            timerId,
            state: TimerStatus.start,
        });
    };

    function initilizeTimer() {
        setMinutes(getMinutesAndSeconds(initTime).minutes);
        setSeconds(getMinutesAndSeconds(initTime).seconds);
        setTimeLeft(initTime);
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
                <p className="roomsWrapper__timer__time">{`${
                    minutes < 10 ? "0" + minutes : minutes
                }:${seconds < 10 ? "0" + seconds : seconds}`}</p>

                <div style={{ opacity: activeTimer ? `1` : `.2` }}>
                    {!isActive && (
                        <PlayIcon
                            onClick={() => {
                                if (activeTimer) startTimer();
                            }}
                        />
                    )}
                    {isActive && (
                        <div className="roomsWrapper__timer__time__actions">
                            <StopIcon
                                onClick={() => {
                                    if (activeTimer) stopAndResetTimer();
                                }}
                            />
                            <PauseIcon
                                onClick={() => {
                                    if (activeTimer) setIsActive(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
