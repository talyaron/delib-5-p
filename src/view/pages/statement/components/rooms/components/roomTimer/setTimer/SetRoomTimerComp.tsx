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
}: Readonly<TimerProps>) {
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
					onKeyUp={(e) => handleInputDigit(e)}
					defaultValue={timeDigits[0]}
				/>

				<input
					type="number"
					min={0}
					max={9}
					step={1}
					maxLength={1}
					tabIndex={1}
					onKeyUp={(e) => handleInputDigit(e)}
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
					onKeyUp={(e) => handleInputDigit(e)}
					defaultValue={timeDigits[2]}
				/>

				<input
					type="number"
					min={0}
					max={9}
					step={1}
					maxLength={1}
					tabIndex={3}
					onKeyUp={(e) => handleInputDigit(e)}
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

	function handleInputDigit(ev: React.KeyboardEvent<HTMLInputElement>) {
		const target = ev.target as HTMLInputElement;
		let digit = ev.key;
		ev.type === "input" || "change"
			? (digit = target.value)
			: (digit = ev.key);

		if (!isNaN(parseInt(digit))) {
			target.valueAsNumber = parseInt(digit);
			const max = parseInt(target.max);
			const tabIndex = parseInt(
                target.getAttribute("tabindex") as string,
			);
			const maxNumber =
                target.valueAsNumber > max ? max : target.valueAsNumber;
			target.value = maxNumber.toString();

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
			target.value = "";
		}
	}
}

export default SetRoomTimerComp;
