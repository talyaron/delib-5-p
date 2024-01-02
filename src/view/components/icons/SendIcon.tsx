export default function SendIcon({ color }: { color: string}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 19 18"
            fill="none"
        >
            <path
                d="M17 1.5L8.75 9.75"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17 1.5L11.75 16.5L8.75 9.75L2 6.75L17 1.5Z"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
