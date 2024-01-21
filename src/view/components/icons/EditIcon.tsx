export default function EditIcon({ color = "lightgray" }: { color?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 24 25"
            fill="none"
        >
            <path
                d="M12 20.4482H21"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.5 3.94847C16.8978 3.55064 17.4374 3.32715 18 3.32715C18.2786 3.32715 18.5544 3.38202 18.8118 3.48862C19.0692 3.59523 19.303 3.75149 19.5 3.94847C19.697 4.14545 19.8532 4.3793 19.9598 4.63667C20.0665 4.89404 20.1213 5.16989 20.1213 5.44847C20.1213 5.72704 20.0665 6.00289 19.9598 6.26026C19.8532 6.51763 19.697 6.75149 19.5 6.94847L7 19.4485L3 20.4485L4 16.4485L16.5 3.94847Z"
                fill={color}
            />
        </svg>
    );
}
