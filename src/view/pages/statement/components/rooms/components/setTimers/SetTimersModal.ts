import { SetTimer } from 'delib-npm';

export const initialTimerArray: SetTimer[] = [
	{
		statementId: '1',
		timerId: '1',
		time: 60 * 1000,
		title: 'talk',
		order: 0,
	},
	{
		statementId: '1',
		timerId: '2',
		time: 60 * 1000,
		title: 'Q&A',
		order: 1,
	},
];
