import { SetTimer } from "delib-npm";
import { useState } from "react";
import styles from "../setTimers.module.scss";
import {
    fromFourDigitsToMillisecons,
    fromMilliseconsToFourDigits,
} from "./AdminTimerCont";

//images
import deleteIcon from "../../../../../../../../assets/icons/delete.svg";
import {
    deleteTimerSettingDB,
    updateTimerSettingDB,
} from "../../../../../../../../functions/db/timer/setTimer";
// import editIcon from "../../../../../../../../assets/icons/edit2.svg";

interface TimerProps {
    statementId: string;
    timer: SetTimer;
    index: number;
    timers: SetTimer[];
    setTimers: React.Dispatch<React.SetStateAction<SetTimer[]>>;
}

function AdminTimer({
    statementId,
    timer,
    index,
    timers,
    setTimers,
}: TimerProps) {
    try {
        if (!statementId) throw new Error("statementId is required");
        const [timeDigits, setTimeDigits] = useState<number[]>(
            fromMilliseconsToFourDigits(timer.time || 1000 * 90),
        );
        const [title, setTitle] = useState<string>(
            timer.title ? timer.title : "Discussion",
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
                        onInput={handleInputDigit}
                        defaultValue={timeDigits[3]}
                    />
                </div>
                <div className={styles.edit}>
                    <img
                        src={deleteIcon}
                        alt="delete"
                        onClick={() => handleDeleteTimer(timer.timerId)}
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
                const newTimers = [...timers].filter(
                    (t) => t.timerId !== timerId,
                );

                setTimers(newTimers);
            } catch (error) {
                console.error(error);
            }
        }

        function handleUpdateName(ev: any) {
            try {
                const newTitle = ev.target.value;
                setTitle(newTitle);
                updateTimerSettingDB({
                    statementId,
                    time: timer.time,
                    title: newTitle,
                    order: timer.order,
                });
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
                return;
            }
            const max = parseInt(ev.target.max);
            const min = parseInt(ev.target.min);

            if (digit > max) digit = max;
            if (digit < min) digit = min;

            ev.target.valueAsNumber = digit;
            const innerindex = ev.target.dataset.innerindex;
            const _digit: number = digit;
            const _digits: number[] = timeDigits.map((d, i) =>
                i === parseInt(innerindex) ? _digit : d,
            );

            setTimeDigits(_digits);
            const newTime = fromFourDigitsToMillisecons(_digits);
            updateTimerSettingDB({
                statementId,
                time: newTime,
                title,
                order: timer.order,
            });
            const tabIndex = parseInt(ev.target.getAttribute("tabindex"));
            const nextInput = document.querySelector(
                `[tabindex="${tabIndex + 1}"]`,
            );
            if (nextInput && !dontGoNext) {
                //@ts-ignore
                nextInput.focus();
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default AdminTimer;
