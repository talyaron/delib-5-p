interface Props {
  onClick: () => void;
  color?: string;
}

export default function PauseIcon({ onClick, color = "#5899E0" }: Props) {
	return (
		<button onClick={onClick} aria-label="Pause">
			<svg
				width="50"
				height="59"
				viewBox="0 0 50 59"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g filter="url(#filter0_dddd_3336_54260)">
					<circle
						cx="25"
						cy="21"
						r="20"
						transform="rotate(180 25 21)"
						fill={color}
					/>
				</g>
				<path
					d="M29.5 29C28.67 29 28 28.33 28 27.5V14.5C28 13.67 28.67 13 29.5 13C30.33 13 31 13.67 31 14.5V27.5C31 28.33 30.33 29 29.5 29Z"
					stroke="white"
					strokeMiterlimit="10"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M20.5 29C19.67 29 19 28.33 19 27.5V14.5C19 13.67 19.67 13 20.5 13C21.33 13 22 13.67 22 14.5V27.5C22 28.33 21.33 29 20.5 29Z"
					stroke="white"
					strokeMiterlimit="10"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<defs>
					<filter
						id="filter0_dddd_3336_54260"
						x="0"
						y="0"
						width="50"
						height="59"
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
							values="0 0 0 0 0.133333 0 0 0 0 0.266667 0 0 0 0 0.407843 0 0 0 0.1 0"
						/>
						<feBlend
							mode="normal"
							in2="BackgroundImageFix"
							result="effect1_dropShadow_3336_54260"
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
							values="0 0 0 0 0.133333 0 0 0 0 0.266667 0 0 0 0 0.407843 0 0 0 0.09 0"
						/>
						<feBlend
							mode="normal"
							in2="effect1_dropShadow_3336_54260"
							result="effect2_dropShadow_3336_54260"
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
							values="0 0 0 0 0.133333 0 0 0 0 0.266667 0 0 0 0 0.407843 0 0 0 0.05 0"
						/>
						<feBlend
							mode="normal"
							in2="effect2_dropShadow_3336_54260"
							result="effect3_dropShadow_3336_54260"
						/>
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="13" />
						<feGaussianBlur stdDeviation="2.5" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.133333 0 0 0 0 0.266667 0 0 0 0 0.407843 0 0 0 0.01 0"
						/>
						<feBlend
							mode="normal"
							in2="effect3_dropShadow_3336_54260"
							result="effect4_dropShadow_3336_54260"
						/>
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="effect4_dropShadow_3336_54260"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>
		</button>
	);
}
