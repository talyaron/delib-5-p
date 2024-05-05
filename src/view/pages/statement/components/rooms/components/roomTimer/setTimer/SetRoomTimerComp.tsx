import React, { useState } from "react";
import styles from "./setRoomTimer.module.scss";
import {
    fromFourDigitsToMilliseconds,
    fromMillisecondsToFourDigits,
} from "../../setTimers/setTimer/SetTimerCont";
import { setTimersInitTimeDB } from "../../../../../../../../controllers/db/timer/setTimer";
import { RoomTimer } from "delib-npm";
import { getRoomTimerId } from "../../../../../../../../controllers/general/helpers";

interface TimerProps {
    roomTimer: RoomTimer;
    setTimerAdjustment: React.Dispatch<React.SetStateAction<boolean>>;
    setInitTime: React.Dispatch<React.SetStateAction<number>>;
}

function SetRoomTimerComp({
    roomTimer,
    setTimerAdjustment,
    setInitTime,
}: TimerProps) {
    const [timeDigits, setTimeDigits] = useState<number[]>(
        fromMillisecondsToFourDigits(roomTimer.time || 1000 * 90),
    );

    return (
        <div className={styles.timer}>
            <div className={styles.time}>
                <input
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    maxLength={1}
                    tabIndex={0}
                    onInput={handleInputDigit}
                    onKeyUp={handleInputDigit}
                    onChange={handleInputDigit}
                    defaultValue={timeDigits[0]}
                />

                <input
                    type="number"
                    min={0}
                    max={9}
                    step={1}
                    maxLength={1}
                    tabIndex={1}
                    onInput={handleInputDigit}
                    onKeyUp={handleInputDigit}
                    onChange={handleInputDigit}
                    defaultValue={timeDigits[1]}
                />
                <span>:</span>
                <input
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    maxLength={1}
                    tabIndex={2}
                    onInput={handleInputDigit}
                    onKeyUp={handleInputDigit}
                    onChange={handleInputDigit}
                    defaultValue={timeDigits[2]}
                />

                <input
                    type="number"
                    min={0}
                    max={9}
                    step={1}
                    maxLength={1}
                    tabIndex={3}
                    onKeyUp={handleInputDigit}
                    onInput={handleInputDigit}
                    onChange={handleInputDigit}
                    defaultValue={timeDigits[3]}
                />
            </div>
            <button
                className="btn btn--cancel"
                onClick={() => handleUpdateTimer()}
                tabIndex={4}
            >
                SET
            </button>
        </div>
    );

    function handleUpdateTimer() {
        const newTime = fromFourDigitsToMilliseconds(timeDigits);

        setTimersInitTimeDB({
            statementId: roomTimer.statementId,
            roomNumber: roomTimer.roomNumber,
            timerId: getRoomTimerId(
                roomTimer.statementId,
                roomTimer.roomNumber,
                roomTimer.order,
            ),
            initTime: newTime,
        });
        setInitTime(newTime);
        setTimerAdjustment(false);
    }

    function handleInputDigit(ev: any) {
        let digit = ev.key;
        ev.type === "input" || "change"
            ? (digit = ev.target.value)
            : (digit = ev.key);

        if (!isNaN(parseInt(digit))) {
            ev.target.valueAsNumber = parseInt(digit);
            const max = parseInt(ev.target.max);
            const tabIndex = parseInt(ev.target.getAttribute("tabindex"));
            const maxNumber =
                ev.target.valueAsNumber > max ? max : ev.target.valueAsNumber;
            ev.target.value = maxNumber;

            const nextInput = document.querySelector(
                `[tabindex="${tabIndex + 1}"]`,
            );

            setTimeDigits((dig) =>
                dig.map((d: number, i: number) =>
                    i === tabIndex ? maxNumber : d,
                ),
            );

            //    dispatch(setSetTimer())

            if (nextInput) {
                //@ts-ignore
                nextInput.focus();
            }
        } else {
            ev.target.value = null;
        }
    }
}

export default SetRoomTimerComp;
