interface Props {
  onClick: () => void;
  color?: string;
}



export default function PlayIcon({ onClick, color="#5770F4"}: Props) {
	return (
		<div  onClick={onClick} role="button" aria-label="Play" tabIndex={0} >
			<svg
				width="50"
				height="58"
				viewBox="0 0 50 58"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g filter="url(#filter0_dddd_3336_54274)">
					<circle
						cx="25"
						cy="21"
						r="20"
						transform="rotate(180 25 21)"
						fill={color}
					/>
				</g>
				<path
					d="M33 21L21 14V28L33 21Z"
					stroke="white"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<defs>
					<filter
						id="filter0_dddd_3336_54274"
						x="0"
						y="0"
						width="50"
						height="58"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="1" />
						<feGaussianBlur stdDeviation="1" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.533333 0 0 0 0 0.615686 0 0 0 0 0.705882 0 0 0 0.1 0"
						/>
						<feBlend
							mode="normal"
							in2="BackgroundImageFix"
							result="effect1_dropShadow_3336_54274"
						/>
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="3" />
						<feGaussianBlur stdDeviation="1.5" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.533333 0 0 0 0 0.615686 0 0 0 0 0.705882 0 0 0 0.09 0"
						/>
						<feBlend
							mode="normal"
							in2="effect1_dropShadow_3336_54274"
							result="effect2_dropShadow_3336_54274"
						/>
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="7" />
						<feGaussianBlur stdDeviation="2" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.533333 0 0 0 0 0.615686 0 0 0 0 0.705882 0 0 0 0.05 0"
						/>
						<feBlend
							mode="normal"
							in2="effect2_dropShadow_3336_54274"
							result="effect3_dropShadow_3336_54274"
						/>
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="12" />
						<feGaussianBlur stdDeviation="2.5" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.533333 0 0 0 0 0.615686 0 0 0 0 0.705882 0 0 0 0.01 0"
						/>
						<feBlend
							mode="normal"
							in2="effect3_dropShadow_3336_54274"
							result="effect4_dropShadow_3336_54274"
						/>
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="effect4_dropShadow_3336_54274"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>
		</div>
	);
}
