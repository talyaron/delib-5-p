import React from 'react';
import style from './TwoColorButton.module.scss';

interface TwoColorButtonProps {
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
	text: string;
	textBackgroundColor: string;
	textColor: string;
	iconBackgroundColor: string;
	onClick: () => void;
	reverse?: boolean;
}

export default function TwoColorButton({
	icon: Icon,
	text,
	textBackgroundColor,
	iconBackgroundColor,
	textColor,
	onClick,
	reverse = false,
}: TwoColorButtonProps) {
	return (
		<button onClick={onClick} className={style.wrapper}>
			{reverse ? (
				<>
					<div style={{ backgroundColor: iconBackgroundColor }}>
						<Icon style={{ color: textBackgroundColor }} />
					</div>
					<p style={{ backgroundColor: textBackgroundColor, color: textColor }}>
						{text}
					</p>
				</>
			) : (
				<>
					<p style={{ backgroundColor: textBackgroundColor, color: textColor }}>
						{text}
					</p>
					<div style={{ backgroundColor: iconBackgroundColor }}>
						<Icon style={{ color: textBackgroundColor }} />
					</div>
				</>
			)}
		</button>
	);
}
