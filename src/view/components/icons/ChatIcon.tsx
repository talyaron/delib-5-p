export default function ChatIcon({
    statementType,
    color = "#226CBC",
}: {
    statementType?: string;
    color?: string;
}) {
    const _color = statementType === "question" ? "#fff" : "#787FFF";
    color = color || _color;

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
                d="M14.5 2H9.5C5.36 2 2 5.36 2 9.5C2 12.76 4.09 15.53 7 16.56V22L12 17H14.5C18.64 17 22 13.64 22 9.5C22 5.36 18.64 2 14.5 2Z"
                stroke={color}
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.9902 13H17.0002"
                stroke={color}
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.9902 13H13.0002"
                stroke={color}
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
