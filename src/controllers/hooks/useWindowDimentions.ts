import { useState, useEffect } from 'react';

function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		// Listen for window resize events
		window.addEventListener('resize', handleResize);

		// Remove the event listener when the component unmounts
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []); // Empty dependency array means this effect runs once after the initial render

	return windowDimensions;
}

export default useWindowDimensions;
