import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useSlideAndSubStatement = (parentId: string|undefined) => {
	const location = useLocation();
	const [toSlide, setToSlide] = useState(false);
	const [toSubStatement, setToSubStatement] = useState(false);
	const [slideInOrOut, setSlideInOrOut] = useState('slide-out');

	useEffect(() => {
		if (!location.state) return;

		if (location.state.from === '/home') {
			setToSubStatement(true);
			setSlideInOrOut('slide-out');
			setToSlide(true);

			return;
		}
		const testToSlide = location.state
			? location.state.from.split('/').length === 4
			: false;

		const previousStateId = location.state
			? location.state.from.split('/')[2]
			: null;

		if (previousStateId === parentId) {
			setToSubStatement(true);
			setSlideInOrOut('slide-out');
		} else {
			setToSubStatement(false);
			setSlideInOrOut('slide-in');
		}

		setToSlide(testToSlide);
	}, [parentId, location.state]);

	return { toSlide, toSubStatement, slideInOrOut };
};

export default useSlideAndSubStatement;
