interface Props {
    onClick: () => void;
}

export default function ChevronLeftIcon({onClick}: Props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            onClick={onClick}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.7071 3.94523C16.3166 3.55471 15.6834 3.55471 15.2929 3.94523L7.2929 11.9452C6.9024 12.3357 6.9024 12.9689 7.2929 13.3594L15.2929 21.3594C15.6834 21.7499 16.3166 21.7499 16.7071 21.3594C17.0976 20.9689 17.0976 20.3357 16.7071 19.9452L9.4142 12.6523L16.7071 5.35945C17.0976 4.96892 17.0976 4.33576 16.7071 3.94523Z"
                fill="#458EDD"
            />
        </svg>
    );
}
