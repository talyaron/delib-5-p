import {useState} from "react";
import { t } from "i18next";
import styles from "./setTimers.module.scss";

const SetTimers = () => {
    return (
        <section>
            <h2>{t("Setting Timers")}</h2>
            <p>{t("You can set the timers for each stage here.")}</p>
            <Timer />
        </section>
    );
};

export default SetTimers;

function Timer() {
    const [timer, setTimer] = useState<number[]>([0, 0, 0, 0]);
    return (
        <div className={styles.timer}>
            <input
                type="number"
                min={0}
                max={5}
                step={1}
                maxLength={1}
                tabIndex={0}
                onKeyUp={handleInputDigit}
            />
            <input
                type="number"
                min={0}
                max={9}
                step={1}
                maxLength={1}
                tabIndex={1}
                onKeyUp={handleInputDigit}
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
            />

            <input
                type="number"
                min={0}
                max={9}
                step={1}
                maxLength={1}
                tabIndex={3}
                onKeyUp={handleInputDigit}
            />
            <div className="btn btn--add">SET</div>
            <p>{timer[0]}{timer[1]}:{timer[2]}{timer[3]}</p>
        </div>
    );

    function handleInputDigit(ev: any) {
        if (!isNaN(parseInt(ev.key))) {
            ev.target.valueAsNumber = parseInt(ev.key);
            const max = parseInt(ev.target.max);
            const tabIndex = parseInt(ev.target.getAttribute("tabindex"));
            const maxNumber = ev.target.valueAsNumber > max? max : ev.target.valueAsNumber;
            ev.target.value = maxNumber;
            
    
            const nextInput = document.querySelector(
                `[tabindex="${tabIndex + 1}"]`,
            );
    
            setTimer(dig=>dig.map((d:number, i:number) => (i === tabIndex ? maxNumber : d)));
    
            if (nextInput) {
                //@ts-ignore
                nextInput.focus();
            }
        } else {
            ev.target.value = null;
        }
    }
    
}


function pressTab() {
    var tabKeyEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        code: "Tab",
        keyCode: 9,
        which: 9,
        shiftKey: false, // Depending on your use case, you might want to change this
        bubbles: true,
    });

    document.dispatchEvent(tabKeyEvent);
}
