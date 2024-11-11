import React, { useState, useRef } from 'react';
import './SetTimer.scss';
import {
	fromFourDigitsToMilliseconds,
	fromMillisecondsToFourDigits,
} from '../../setTimers/setTimer/SetTimerCont';
import { setTimersInitTimeDB } from '@/controllers/db/timer/setTimer';
import { RoomTimer } from 'delib-npm';
import { getRoomTimerId } from '@/controllers/general/helpers';

interface TimerProps {
	roomTimer: RoomTimer;
	setTimerAdjustment: React.Dispatch<React.SetStateAction<boolean>>;
	setInitTime: React.Dispatch<React.SetStateAction<number>>;
}

function SetTimer({
	roomTimer,
	setTimerAdjustment,
	setInitTime,
}: Readonly<TimerProps>) {
	const [timeDigits, setTimeDigits] = useState<number[]>(
		fromMillisecondsToFourDigits(roomTimer.time || 1000 * 90)
	);

	// Refs for the inputs
	const inputRefs = useRef<HTMLInputElement[]>([]);

	return (
		<div className="set-timer">
			<div className="time">
				{[0, 1, 2, 3].map((index) => (
					<React.Fragment key={index}>
						<input
							type="number"
							ref={(el) => (inputRefs.current[index] = el!)}
							min={index % 2 === 0 ? 0 : index === 1 ? 9 : 5}
							max={index % 2 === 0 ? 5 : 9}
							step={1}
							maxLength={1}
							onKeyUp={(e) => handleInputDigit(e, index)}
							defaultValue={timeDigits[index]}
						/>
						{index === 1 && <span>:</span>}
					</React.Fragment>
				))}
			</div>
			<button className="btn btn--cancel" onClick={handleUpdateTimer}>
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
				roomTimer.order
			),
			initTime: newTime,
		});
		setInitTime(newTime);
		setTimerAdjustment(false);
	}

	function handleInputDigit(
		ev: React.KeyboardEvent<HTMLInputElement>,
		index: number
	) {
		const target = ev.target as HTMLInputElement;
		const digit = ev.key;

		if (!isNaN(parseInt(digit))) {
			const newValue = Math.min(parseInt(digit), parseInt(target.max));

			setTimeDigits((prevDigits) =>
				prevDigits.map((d, i) => (i === index ? newValue : d))
			);

			// Move focus to the next input
			if (inputRefs.current[index + 1]) {
				inputRefs.current[index + 1].focus();
			}
		} else {
			target.value = ''; // Clear the input if non-numeric
		}
	}
}

export default SetTimer;
