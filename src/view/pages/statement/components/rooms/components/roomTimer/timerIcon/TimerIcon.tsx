import {
	colorArr,
	timePassedColor,
	transformArr,
	xPositionArr,
	yPositionArr,
} from './TimerIconModel';

interface Props {
	percent: number;
}

export default function TimerIcon({ percent }: Props) {
	const rectArr = xPositionArr
		.map((x, i) => (
			<rect
				key={i}
				x={x}
				y={yPositionArr[i]}
				width="3.21563"
				height="14.4144"
				rx="1.60782"
				transform={`rotate(${transformArr[i]} ${x} ${yPositionArr[i]})`}
				fill={colorArr[i]}
			/>
		))
		.map((rect, i) => {
			return (
				<rect
					key={i}
					x={rect.props.x}
					y={rect.props.y}
					width="3.21563"
					height="14.4144"
					rx="1.60782"
					transform={rect.props.transform}
					fill={percent + (i + 1) * 4.3 > 100 ? colorArr[i] : timePassedColor}
				/>
			);
		});

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="204"
			height="204"
			viewBox="0 0 204 204"
			fill="none"
		>
			{rectArr}
		</svg>
	);
}
