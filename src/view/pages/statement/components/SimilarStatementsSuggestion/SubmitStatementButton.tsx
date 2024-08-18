import React from 'react';
import style from '@/view/components/buttons/TwoColorButton/TwoColorButton.module.scss';

interface SubmitStatementButtonProps {
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
	text: string;
	buttonMaxWidth: string,
	textColor: string;
	onClick: () => void;
	reverse?: boolean;
}

export default function SubmitStatementButton({
	icon: Icon,
	text,
	buttonMaxWidth,
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
					<p style={{backgroundColor: textColor, color: textColor }}>
						{text}
					</p>
				</>
			) : (
				<>
					<p style={{borderRadius: "2rem 0px 0px 2rem", backgroundColor: "var(--button-blue)", color: textColor, width: buttonMaxWidth}}>
						{text}
					</p>
					<div style={{position: "relative", right: "1rem",border: "2px solid var(--white)" ,borderRadius: "2rem", backgroundColor: "var(--button-blue)" }}>
						<Icon style={{ color: textColor }} />
					</div>
				</>
			)}
		</button>
	);
}
