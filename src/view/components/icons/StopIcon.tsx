interface Props {
    onClick: () => void;
}

export const actionCircleStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "#FFF",
	width: "3rem",
	height: "3rem",
	borderRadius: "50%",
	cursor: "pointer",
	boxShadow: "0px 5px 10px var(--shadow)",
};

export default function StopIcon({ onClick }: Props) {
	const square = {
		width: "1.1rem",
		height: "1.1rem",
		backgroundColor: "#226CBC",
		borderRadius: "0.2rem",
	};
    
	return (
		<div style={actionCircleStyle} onClick={onClick}>
			<div style={square}/>
		</div>
	);
}
