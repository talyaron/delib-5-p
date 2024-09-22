interface Props {
  onClick: () => void;
  color?: string;
}


export default function StopIcon({ onClick, color = "#5899E0" }: Props) {


	return (
		<div  onClick={onClick} role="button" aria-label="Stop" tabIndex={0}>
			<svg
				width="50"
				height="59"
				viewBox="0 0 50 59"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g filter="url(#filter0_dddd_3336_54264)">
					<circle
						cx="25"
						cy="21"
						r="20"
						transform="rotate(180 25 21)"
						fill={color}
					/>
				</g>
				<path
					d="M30.417 28.5832H19.5837C18.392 28.5832 17.417 27.6082 17.417 26.4165V15.5832C17.417 14.3915 18.392 13.4165 19.5837 13.4165H30.417C31.6087 13.4165 32.5837 14.3915 32.5837 15.5832V26.4165C32.5837 27.6082 31.6087 28.5832 30.417 28.5832Z"
					stroke="white"
					strokeWidth="1.08333"
					strokeMiterlimit="10"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<defs>
					<filter
						id="filter0_dddd_3336_54264"
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
							result="effect1_dropShadow_3336_54264"
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
							in2="effect1_dropShadow_3336_54264"
							result="effect2_dropShadow_3336_54264"
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
							in2="effect2_dropShadow_3336_54264"
							result="effect3_dropShadow_3336_54264"
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
							in2="effect3_dropShadow_3336_54264"
							result="effect4_dropShadow_3336_54264"
						/>
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="effect4_dropShadow_3336_54264"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>
		</div>
	);
}
