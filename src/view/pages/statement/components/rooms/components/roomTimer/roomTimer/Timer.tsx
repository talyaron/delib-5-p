import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { getMinutesAndSeconds } from '../timerPageController';
import { RoomTimer, TimerStatus } from 'delib-npm';
import {
	setTimersStatusDB,
	startNextTimer,
} from '@/controllers/db/timer/setTimer';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import { selectTimerByTimerId } from '@/model/timers/timersSlice';
import './Timer.scss';

// icons

import TimerIcon from '../timerIcon/TimerIcon';
import PlayIcon from '@/view/components/icons/PlayIcon';
import PauseIcon from '@/view/components/icons/PauseIcon';
import StopIcon from '@/view/components/icons/StopIcon';

//sound
import bell from '@/assets/sounds/bell.mp3';

interface Props {
	roomTimer: RoomTimer;
	isActiveTimer: boolean;
}

export default function Timer({
	roomTimer,
	isActiveTimer,
}: Readonly<Props>): JSX.Element {
	const storeTimer: RoomTimer | undefined = useAppSelector(
		selectTimerByTimerId(roomTimer.roomTimerId)
	);

	//@ts-ignore
	const bellRef: MutableRefObject = useRef(null);
	const playSound = () => {
		bellRef?.current?.play();
	};

	// useState
	const initTime = roomTimer.time;
	const [timeLeft, setTimeLeft] = useState(roomTimer.time);

	const [minutes, setMinutes] = useState(
		getMinutesAndSeconds(roomTimer.time).minutes
	);
	const [seconds, setSeconds] = useState(
		getMinutesAndSeconds(roomTimer.time).seconds
	);
	const [isActive, setIsActive] = useState(false);
	const [timer, setTimer] = useState<
		string | number | NodeJS.Timeout | undefined
	>();

	const percent = (timeLeft / initTime) * 100;

	const interval = () =>
		setInterval(() => {
			setTimeLeft((prev) => {
				const newTime = prev - 1000;
				if (newTime < 0) {
					setIsActive(false);
					initializeTimer();
					clearInterval(timer);
					setTimersStatusDB(roomTimer, TimerStatus.finish);
					startNextTimer(roomTimer);
					playSound();

					return 0;
				}

				setMinutes(getMinutesAndSeconds(newTime).minutes);
				setSeconds(getMinutesAndSeconds(newTime).seconds);

				return newTime;
			});
		}, 1000);

	useEffect(() => {
		setTimeLeft(initTime);
		setMinutes(getMinutesAndSeconds(initTime).minutes);
		setSeconds(getMinutesAndSeconds(initTime).seconds);
	}, [roomTimer]);

	useEffect(() => {
		if (isActive) {
			setTimer(interval());
		} else {
			clearInterval(timer);
		}

		return () => {
			if (timer) {
				clearInterval(timer);
				setTimer(undefined);
			}
		};
	}, [isActive]);

	useEffect(() => {
		if (storeTimer?.state === TimerStatus.start) {
			startTimer();
		} else if (storeTimer?.state === TimerStatus.pause) {
			pauseTimer();
		} else if (storeTimer?.state === TimerStatus.finish) {
			stopAndResetTimer();
		}
	}, [storeTimer?.state]);

	const stopAndResetTimer = () => {
		setIsActive(false);
		setTimeLeft(initTime);
		setMinutes(getMinutesAndSeconds(initTime).minutes);
		setSeconds(getMinutesAndSeconds(initTime).seconds);
	};
	const startTimer = (): void => {
		setIsActive(true);

		//send a message to the server that the timer has started
	};

	const pauseTimer = () => {
		setIsActive(false);
	};

	function initializeTimer() {
		setMinutes(getMinutesAndSeconds(initTime).minutes);
		setSeconds(getMinutesAndSeconds(initTime).seconds);
		setTimeLeft(initTime);
	}

	return (
		<div className='timer'>
			<h2>{roomTimer.title}</h2>
			<div className='clock'>
				<TimerIcon percent={percent} />
			</div>
			<div className='digits'>
				<p>{`${minutes < 10 ? '0' + minutes : minutes}:${
					seconds < 10 ? '0' + seconds : seconds
				}`}</p>
			</div>
			<div
				className='timer-buttons'
				style={{ opacity: isActiveTimer ? '1' : '0.2' }}
			>
				{!isActive && (
					<PlayIcon
						onClick={() => {
							if (isActiveTimer) {
								startTimer();
								setTimersStatusDB(roomTimer, TimerStatus.start);
							}
						}}
					/>
				)}

				{isActive && (
					<>
						<StopIcon
							onClick={() => {
								if (isActiveTimer) {
									stopAndResetTimer();
									setTimersStatusDB(roomTimer, TimerStatus.finish);
								}
							}}
						/>
						<PauseIcon
							onClick={() => {
								if (isActiveTimer) {
									pauseTimer();
									setTimersStatusDB(roomTimer, TimerStatus.pause);
								}
							}}
						/>
					</>
				)}
			</div>
			<audio ref={bellRef}>
				<source src={bell} type='audio/mpeg' />
				<track kind='captions' />
				Your browser does not support the audio element.
			</audio>
		</div>
	);
}
