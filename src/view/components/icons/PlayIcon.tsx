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

export default function PlayIcon({ onClick }: Props) {

    return (
        <div style={actionCircleStyle} onClick={onClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1.1rem"
                viewBox="0 0 18 22"
                fill="none"
            >
                <path
                    d="M0.0266795 2.00648L0.302692 19.6023C0.323739 20.944 1.81416 21.7361 2.94066 20.9879L16.6279 11.9732C17.6705 11.2943 17.6466 9.76566 16.5829 9.10281L2.61989 0.53877C1.47048 -0.173706 0.00563226 0.664721 0.0266795 2.00648Z"
                    fill="#226CBC"
                />
            </svg>
        </div>
    );
}
