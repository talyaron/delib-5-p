import React from 'react';
import style from '@/view/components/buttons/TwoColorButton/TwoColorButton.module.scss';

interface SubmitStatementButtonProps {
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
	text: string;
	buttonRadius: string,
	buttonBackground: string,
	buttonWidth: string,
	circlePos: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static';
	circleRight: string;
	circleBorder: string;
	circleRadius: string;
	circleBackground: string;
	textColor: string;
	onClick: () => void;
	reverse?: boolean;
}

export default function SubmitStatementButton({
	icon: Icon,
	text,
	buttonRadius,
	buttonBackground,
	buttonWidth,
	circlePos,
	circleRight,
	circleBorder,
	circleRadius,
    circleBackground,
	textColor,
	onClick,
	reverse = false,
}: SubmitStatementButtonProps) {
	return (
		<button onClick={onClick} className={style.wrapperWithoutBoxShadow}>
			{reverse ? (
				<>
					<div>
						<Icon style={{ color: textColor }} />
					</div>
					<p style={{ backgroundColor: textColor, color: textColor }}>
						{text}
					</p>
				</>
			) : (
				<>
					<p style={{borderRadius: buttonRadius, backgroundColor: buttonBackground, color: textColor, width: buttonWidth}}>
						{text}
					</p>
					<div style={{position: circlePos, right: circleRight ,border: circleBorder ,borderRadius: circleRadius, backgroundColor: circleBackground }}>
						<Icon style={{ color: textColor }} />
					</div>
				</>
			)}
		</button>
	);
}
