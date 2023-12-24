export default function HomeIcon({ color }: { color: string }) {
    return (
        <svg
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 24 24"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6.5 20V11H3L12 5L21 11H17.5V20H14.5V16.5C14.5 15.6716 13.8284 15 13 15H11C10.1716 15 9.5 15.6716 9.5 16.5V20H6.5Z"
                fill={color}
                stroke={color}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}
