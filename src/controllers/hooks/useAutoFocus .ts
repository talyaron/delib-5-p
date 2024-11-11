import { useEffect, useRef } from 'react';

const useAutoFocus = (isEdit: boolean) => {
	const inputRef = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		if (isEdit && inputRef.current) {
			const { current } = inputRef;
			const length = current.value.length;
			current.focus();
			current.setSelectionRange(length, length);

			if (current) {
				current.style.height = `${current.scrollHeight}px`;
			}
		}
	}, [isEdit]);

	return inputRef;
};

export default useAutoFocus;
