import React, { useEffect, useState } from "react";
import styles from "./setTimer.module.scss";
import {
    fromFourDigitsToMillisecons,
    fromMilliseconsToFourDigits,
} from "../../admin/setTimers/setTimer/SetTimerCont";
import { setTimersInitTimeDB } from "../../../../../../../functions/db/timer/setTimer";

import { useAppDispatch } from "../../../../../../../functions/hooks/reduxHooks";
import { setSetTimer } from "../../../../../../../model/timers/timersSlice";

//scss


interface TimerProps {
    statementId: string;
    roomNumber: number;
    timerId: number;
    initTime: number;
    setTimerAdjustment: React.Dispatch<React.SetStateAction<boolean>>;
    setInitTime: React.Dispatch<React.SetStateAction<number>>;
 
}

function SetTimerComp({
    statementId,
    roomNumber,
    timerId,
    initTime,
    setTimerAdjustment,
    setInitTime
}: TimerProps) {

    const dispatch = useAppDispatch();
    
    const [timeDigits, setTimeDigits] = useState<number[]>(
        fromMilliseconsToFourDigits(initTime || 1000 * 90),
    );

    useEffect(() => {
        console.log(timeDigits)
    }, [timeDigits]);

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
        console.log(timeDigits)
        const newTime = fromFourDigitsToMillisecons(timeDigits);
        console.log(newTime)
        setTimersInitTimeDB({
            statementId,
            roomNumber,
            timerId,
            initTime: newTime,
        });
        setInitTime(newTime);
        setTimerAdjustment(false);
    }

    function handleInputDigit(ev: any) {
        let digit = ev.key;
        ev.type === "input" || "change" ? (digit = ev.target.value) : (digit = ev.key);
      
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

export default SetTimerComp;
