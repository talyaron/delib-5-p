export function getMinutesAndSeconds(milliseconds: number) {
	// Convert milliseconds to seconds
	const totalSeconds = Math.floor(milliseconds / 1000);

	// Calculate minutes and remaining seconds
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return { minutes, seconds };
}