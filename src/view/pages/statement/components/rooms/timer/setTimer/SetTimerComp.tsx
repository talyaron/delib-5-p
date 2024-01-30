import { useState } from "react";
import styles from "./setTimer.module.scss";
import {
    fromFourDigitsToMillisecons,
    fromMilliseconsToFourDigits,
} from "../../admin/setTimers/timer/AdminTimerCont";
import { setTimersInitTimeDB } from "../../../../../../../functions/db/timer/setTimer";
//scss


interface TimerProps {
    statementId: string;
    roomNumber: number;
    timerId: number;
    initTime: number;
    setTimerAdjustment: Function;
    setInitTime: Function;
 
}

function SetTimerComp({
    statementId,
    roomNumber,
    timerId,
    initTime,
    setTimerAdjustment,
    setInitTime
}: TimerProps) {
    
    const [timeDigits, setTimeDigits] = useState<number[]>(
        fromMilliseconsToFourDigits(initTime || 1000 * 90),
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
                    onKeyUp={handleInputDigit}
                    defaultValue={timeDigits[0]}
                />

                <input
                    type="number"
                    min={0}
                    max={9}
                    step={1}
                    maxLength={1}
                    tabIndex={1}
                    onKeyUp={handleInputDigit}
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
                    onKeyUp={handleInputDigit}
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
        const newTime = fromFourDigitsToMillisecons(timeDigits);
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
        ev.type === "input" ? (digit = ev.target.value) : (digit = ev.key);
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
