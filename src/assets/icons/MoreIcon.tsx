import { FC } from "react";

interface Props {
    color?: string;
}

const MoreIcon: FC<Props> = ({ color = "#787FFF" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M11.9999 13C12.5522 13 12.9999 12.5523 12.9999 12C12.9999 11.4477 12.5522 11 11.9999 11C11.4476 11 10.9999 11.4477 10.9999 12C10.9999 12.5523 11.4476 13 11.9999 13Z"
                stroke={color}
                stroke-width="1.99832"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M11.9999 6C12.5522 6 12.9999 5.55228 12.9999 5C12.9999 4.44772 12.5522 4 11.9999 4C11.4476 4 10.9999 4.44772 10.9999 5C10.9999 5.55228 11.4476 6 11.9999 6Z"
                stroke={color}
                stroke-width="1.99832"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M11.9999 20C12.5522 20 12.9999 19.5523 12.9999 19C12.9999 18.4477 12.5522 18 11.9999 18C11.4476 18 10.9999 18.4477 10.9999 19C10.9999 19.5523 11.4476 20 11.9999 20Z"
                stroke={color}
                stroke-width="1.99832"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};

export default MoreIcon;
