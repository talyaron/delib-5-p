
export function converToMillisecons(timer: number[]) {
	const minutes = timer[0] * 10 + timer[1];
	const seconds = timer[2] * 10 + timer[3];

	return (seconds + minutes * 60) * 1000;
}


