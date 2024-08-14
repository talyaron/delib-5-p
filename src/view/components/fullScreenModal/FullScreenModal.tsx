import React from 'react';

import './fullScreenModal.scss';

interface FullScreenModalProps {
	children: React.ReactNode;
}

export default function FullScreenModal({
	children,
}: FullScreenModalProps) {
	return (
		<div className='fullScreenModal'>
			{children}
		</div>
	);
}
