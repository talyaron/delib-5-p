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
        const [_name, setName] = useState<string>(
            timer.name ? timer.name : "Discussion",
        );

        return (
            <div className={styles.timer}>
                <div>
                    <label>Name of Timer</label>
                    <input
                        type="text"
                        defaultValue={_name}
                        onInput={handleUpdateName}
                    />
                </div>
                <div className={styles.time}>
                    <input
                        type="number"
                        min={0}
                        max={5}
                        step={1}
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
                const newName = ev.target.value;
                setName(newName);
                updateTimerSettingDB({
                    statementId,
                    time: timer.time,
                    name: newName,
                    order: timer.order,
                });
            } catch (error) {
                console.error(error);
            }
        }

        function handleInputDigit(ev: any) {
            let digit = ev.key;
            ev.type === "input" ? (digit = ev.target.value) : (digit = ev.key);
       
            if (!isNaN(parseInt(digit))) {
                ev.target.valueAsNumber = parseInt(digit);
                const max = parseInt(ev.target.max);
                const tabIndex = parseInt(ev.target.getAttribute("tabindex"));
                const maxNumber =
                    ev.target.valueAsNumber > max
                        ? max
                        : ev.target.valueAsNumber;
                ev.target.value = maxNumber;

                const nextInput = document.querySelector(
                    `[tabindex="${tabIndex + 1}"]`,
                );

                setTimeDigits((dig) =>
                    dig.map((d: number, i: number) =>
                        i === tabIndex ? maxNumber : d,
                    ),
                );
                const _timeDigits = timeDigits.map((d, i) => i === tabIndex ? maxNumber : d);
console.log(tabIndex,maxNumber, _timeDigits)
                const newTime = fromFourDigitsToMillisecons(_timeDigits);
                const timerIndex = timers.findIndex(
                    (t) => t.timerId === timer.timerId,
                );
                const newTimers = [...timers];
                newTimers[timerIndex].time = newTime;
                setTimers(newTimers);
console.log("updateTimerSettingDB",newTime, _name, timer.order)
                updateTimerSettingDB({
                    statementId,
                    time: newTime,
                    name: _name,
                    order: timer.order,
                });

                if (nextInput) {
                    //@ts-ignore
                    nextInput.focus();
                }
            } else {
                ev.target.value = null;
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default AdminTimer;
