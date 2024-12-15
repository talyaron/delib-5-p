import { DeliberativeElement } from 'delib-npm';

import { useEffect, useState } from 'react';

export interface StatementStyleProps {
	backgroundColor: string;
	color: string;
}

export default function useStatementColor({
	deliberativeElement,
	isResult,
}: {
	deliberativeElement?: DeliberativeElement;
	isResult?: boolean;
}): StatementStyleProps {
	const initStyle = {
		backgroundColor: 'var(--header-home)',
		color: 'white',
	};
	const [style, setStyle] = useState(initStyle);

	useEffect(() => {
		if (deliberativeElement === DeliberativeElement.research) {
			setStyle({
				backgroundColor: 'var(--question-header)',
				color: 'var(--white)',
			});
		} else if (deliberativeElement === DeliberativeElement.option && isResult) {
			setStyle({
				backgroundColor: 'var(--agree)',
				color: 'var(--header)',
			});
		} else if (deliberativeElement === DeliberativeElement.option) {
			setStyle({
				backgroundColor: 'var(--option)',
				color: 'var(--white)',
			});
		} else if (deliberativeElement === DeliberativeElement.general) {
			setStyle({
				backgroundColor: 'var(--header-home)',
				color: 'white',
			});
		} else {
			setStyle(initStyle);
		}
	}, [deliberativeElement, isResult]);

	return style;
}
