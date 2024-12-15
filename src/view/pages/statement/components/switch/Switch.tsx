import React from 'react';
import { useParams } from 'react-router-dom';
import StatementSettings from '../settings/StatementSettings';

export default function Switch(): React.ReactElement {
	const { page } = useParams();

	switch (page) {
		case 'settings':
			return <StatementSettings />;
		case 'chat':
			return <div>Chat</div>;
		default:
			return <div>Default</div>;
	}
}
