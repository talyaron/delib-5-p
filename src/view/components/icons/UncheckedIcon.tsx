export default function UncheckedIcon({
    color = "#787FFF",
}: {
    color?: string;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 18 18"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 0H16C17.1 0 18 0.9 18 2V16C18 17.1 17.1 18 16 18H2C0.9 18 0 17.1 0 16V2C0 0.9 0.9 0 2 0ZM2.25 16.875H15.75C16.3687 16.875 16.875 16.3687 16.875 15.75V2.25C16.875 1.63125 16.3687 1.125 15.75 1.125H2.25C1.63125 1.125 1.125 1.63125 1.125 2.25V15.75C1.125 16.3687 1.63125 16.875 2.25 16.875Z"
                fill={color}
            />
        </svg>
    );
}
