interface GetBarWidthParams {
	isVertical: boolean;
	totalOptionsCount: number;
	screenWidth: number;
}

export const getBarWidth = ({
	isVertical,
	totalOptionsCount,
	screenWidth,
}: GetBarWidthParams): number => {
	const horizontalBarWidth = 70;

	if (screenWidth > 500) {
		return 96;
	}
	if (isVertical) {
		if (totalOptionsCount <= 3) {
			return 96;
		}
		if (totalOptionsCount >= 4) {
			return 86;
		}
	}

	return horizontalBarWidth;
};
