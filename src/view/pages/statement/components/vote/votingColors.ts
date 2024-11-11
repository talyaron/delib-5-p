const votingColors = [
	'#DB887F',
	'#B5A17F',
	'#A1BF8A',
	'#74BDE3',
	'#86C7C9',
	'#9E86C9',
	'#C38FD4',
	'#AD7390',
	'#F57C8C',
	'#D6A5B9',
	'#93BDDB',
	'#68BAB7',
	'#9DB2A2',
	'#E5B9A7',
	'#E5A996',
	'#E5A085',
	'#F48EB3',
	'#CF767A',
	'#D578A6',
	'#CCA4E1',
	'#A89CE9',
	'#AC94D8',
	'#A992D4',
	'#83ADF3',
	'#8FC8F1',
	'#84D3D6',
	'#64C8C4',
	'#9EC7C9',
	'#EC8B81',
	'#E49D81',
	'#EDA792',
	'#E8BDAD',
	'#C7AF87',
	'#E5B463',
	'#9BBAA2',
	'#8BD09B',
	'#97C99B',
	'#8BB9A9',
];

export const getRandomColor = (existingColors: string[]): string => {
	let color = votingColors[Math.floor(Math.random() * votingColors.length)];

	while (existingColors.includes(color)) {
		color = votingColors[Math.floor(Math.random() * votingColors.length)];
	}

	return color;
};
