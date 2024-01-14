export default function DisconnectIcon({ color }: { color: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 27 24"
            fill="none"
        >
            <path
                d="M10.5452 21H6.26421C5.69652 21 5.15208 20.7893 4.75065 20.4142C4.34923 20.0391 4.12372 19.5304 4.12372 19V5C4.12372 4.46957 4.34923 3.96086 4.75065 3.58579C5.15208 3.21071 5.69652 3 6.26421 3H10.5452"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18.037 17L23.3882 12L18.037 7"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23.3882 12H10.5452"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
