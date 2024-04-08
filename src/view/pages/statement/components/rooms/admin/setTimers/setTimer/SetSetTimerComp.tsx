import { SetTimer } from "delib-npm";
import { useState } from "react";
import styles from "../setTimers.module.scss";
import {
    fromFourDigitsToMillisecons,
    fromMilliseconsToFourDigits,
} from "./SetTimerCont";

//images
import deleteIcon from "../../../../../../../../assets/icons/delete.svg";
import { deleteTimerSettingDB } from "../../../../../../../../functions/db/timer/setTimer";
import { useAppDispatch } from "../../../../../../../../functions/hooks/reduxHooks";
import {
    setSetTimerTime,
    setSetTimerTitle,
} from "../../../../../../../../model/timers/timersSlice";

interface TimerProps {
    setTimer: SetTimer;
    index: number;
}

function SetSetTimerComp({ setTimer, index }: TimerProps) {
    try {
        if (!setTimer) return null;
        if (!setTimer.statementId) throw new Error("statementId is required");

        const dispatch = useAppDispatch();

        const [timeDigits, setTimeDigits] = useState<number[]>(
            fromMilliseconsToFourDigits(setTimer.time || 1000 * 90),
        );
        const [title, setTitle] = useState<string>(
            setTimer.title ? setTimer.title : "Discussion",
        );

        return (
            <div className={styles.timer}>
                <div>
                    <label>Name of Timer</label>
                    <input
                        type="text"
                        defaultValue={title}
                        onInput={handleUpdateName}
                    />
                </div>
                <div className={styles.time}>
                    <input
                        type="number"
                        min={0}
                        max={5}
                        step={1}
                        data-innerindex={0}
                        maxLength={1}
                        tabIndex={index * 4 + 0}
                        onKeyUp={handleInputDigit}
                        onInput={handleInputDigit}
                        defaultValue={timeDigits[0]}
                    />

                    <input
                        type="number"
                        min={0}
                        max={9}
                        step={1}
                        data-innerindex={1}
                        maxLength={1}
                        tabIndex={index * 4 + 1}
                        onKeyUp={handleInputDigit}
                        onInput={handleInputDigit}
                        defaultValue={timeDigits[1]}
                    />
                    <span>:</span>
                    <input
                        type="number"
                        min={0}
                        max={5}
                        step={1}
                        data-innerindex={2}
                        maxLength={1}
                        tabIndex={index * 4 + 2}
                        onKeyUp={handleInputDigit}
                        onInput={handleInputDigit}
                        defaultValue={timeDigits[2]}
                    />

                    <input
                        type="number"
                        min={0}
                        max={9}
                        step={1}
                        data-innerindex={3}
                        maxLength={1}
                        tabIndex={index * 4 + 3}
                        onKeyUp={handleInputDigit}
                        onChange={handleInputDigit}
                        defaultValue={timeDigits[3]}

                        // onInput={handleInputDigit}
                    />
                </div>
                <div className={styles.edit}>
                    <img
                        src={deleteIcon}
                        alt="delete"
                        onClick={() => handleDeleteTimer(setTimer.timerId)}
                        className="clickable"
                    />
                </div>
            </div>
        );

        function handleDeleteTimer(timerId: string) {
            try {
                const isDelete = confirm(
                    `Are you sure you want to delete this timer?`,
                );
                if (!isDelete) return;

                deleteTimerSettingDB(timerId);

                // const newTimers = [...timers].filter(
                //     (t) => t.timerId !== timerId,
                // );
            } catch (error) {
                console.error(error);
            }
        }

        function handleUpdateName(ev: any) {
            try {
                const newTitle = ev.target.value;
                setTitle(newTitle);
                dispatch(
                    setSetTimerTitle({
                        timerId: setTimer.timerId,
                        title: newTitle,
                    }),
                );
            } catch (error) {
                console.error(error);
            }
        }

        function getKeyNumber(ev: any): number | false {
            try {
                let digit: number | false = false;

                if (
                    ev.type === "keyup" &&
                    (ev.key === "ArrowUp" || ev.key === "ArrowDown")
                ) {
                    digit = ev.target.valueAsNumber;
                } else if (ev.type === "keyup" && !isNaN(parseInt(ev.key))) {
                    digit = parseInt(ev.key);
                }

                if (digit === false) {
                    return false;
                }

                return digit;
            } catch (error) {
                console.error(error);

                return false;
            }
        }

        function handleInputDigit(ev: any) {
            const isTab = ev.key === "Tab";
            const dontGoNext = ev.key === "ArrowDown" || ev.key === "ArrowUp";
            if (isTab) {
                ev.target.valueAsNumber = parseInt(ev.target.value);

                return;
            }

            let digit = getKeyNumber(ev);

            if (digit === false) {
                digit = ev.target.valueAsNumber;
                const _digits = getNewForDigits();
                const newTime = fromFourDigitsToMillisecons(_digits);
                dispatch(
                    setSetTimerTime({
                        timerId: setTimer.timerId,
                        time: newTime,
                    }),
                );

                return;
            }
            const max = parseInt(ev.target.max);
            const min = parseInt(ev.target.min);

            if (digit > max) digit = max;
            if (digit < min) digit = min;

            ev.target.valueAsNumber = digit;
            const _digits = getNewForDigits();

            setTimeDigits(_digits);
            const newTime = fromFourDigitsToMillisecons(_digits);

            dispatch(
                setSetTimerTime({ timerId: setTimer.timerId, time: newTime }),
            );

            const tabIndex = parseInt(ev.target.getAttribute("tabindex"));
            const nextInput = document.querySelector(
                `[tabindex="${tabIndex + 1}"]`,
            );
            if (nextInput && !dontGoNext) {
                //@ts-ignore
                nextInput.focus();
            }

            function getNewForDigits() {
                const innerindex = ev.target.dataset.innerindex;
                const _digit: number = digit || ev.target.valueAsNumber;
                const _digits: number[] = timeDigits.map((d, i) =>
                    i === parseInt(innerindex) ? _digit : d,
                );

                return _digits;
            }
        }
    } catch (error) {
        console.error(error);

        return null;
    }
}

export default SetSetTimerComp;
