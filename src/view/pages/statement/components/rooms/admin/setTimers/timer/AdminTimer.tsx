import { SetTimer } from 'delib-npm';
import { converToMillisecons } from '../SetTimersCont';
import { useState } from 'react';
import styles from '../setTimers.module.scss';

interface TimerProps {
    time?: number;
    name?: string;
    index: number;
    setTimers: Function;
    timers: SetTimer[];
}


function AdminTimer({name, time, index, setTimers, timers }: TimerProps) {
    const [timer, setTimer] = useState<number[]>([0, 0, 0, 0]);
    const [_name, setName] = useState<string>(name?name:"Discussion");
    return (
        <div className={styles.timer}>
            <div>
                <label>Name of Timer</label>
                <input type="text" defaultValue={_name} onInput={(ev:any)=>setName(ev.target.value)} />
            </div>
            <input
                type="number"
                min={0}
                max={5}
                step={1}
                maxLength={1}
                tabIndex={index*4+0}
                onKeyUp={handleInputDigit}
            />

            <input
                type="number"
                min={0}
                max={9}
                step={1}
                maxLength={1}
                tabIndex={index*4+1}
                onKeyUp={handleInputDigit}
            />
            <span>:</span>
            <input
                type="number"
                min={0}
                max={5}
                step={1}
                maxLength={1}
                tabIndex={index*4+2}
                onKeyUp={handleInputDigit}
            />

            <input
                type="number"
                min={0}
                max={9}
                step={1}
                maxLength={1}
                tabIndex={index*4+3}
                onKeyUp={handleInputDigit}
            />
            <div className="btn btn--add" onClick={handleSetTimer}>
                SET
            </div>
            <div className="btn btn--add" onClick={handleAddTimer}>
                ADD
            </div>
           
        </div>
    );

    function handleSetTimer() {
        try {
            const _timers = [...timers];
            _timers[index] = {
                time: converToMillisecons(timer),
                name:_name,
                order: index,
            };
           
            setTimers(_timers);

        } catch (error) {
            console.error(error);
        }
    }

    function handleAddTimer() {
        try {
            const _timers = [...timers];
            _timers.push({
                time: converToMillisecons(timer),
                name:_name,
                order: index,
            });
           
            setTimers(_timers);

        } catch (error) {
            console.error(error);
        }
    }

    function handleInputDigit(ev: any) {
        if (!isNaN(parseInt(ev.key))) {
            ev.target.valueAsNumber = parseInt(ev.key);
            const max = parseInt(ev.target.max);
            const tabIndex = parseInt(ev.target.getAttribute("tabindex"));
            const maxNumber =
                ev.target.valueAsNumber > max ? max : ev.target.valueAsNumber;
            ev.target.value = maxNumber;

            const nextInput = document.querySelector(
                `[tabindex="${tabIndex + 1}"]`,
            );

            setTimer((dig) =>
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

export default AdminTimer