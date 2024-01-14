import { FC } from "react";

interface Props {
    color: string;
}

const InfoIcon: FC<Props> = ({ color = "white" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
        >
            <path
                d="M11.882 20.6668C16.9446 20.6668 21.0487 16.5628 21.0487 11.5002C21.0487 6.43755 16.9446 2.3335 11.882 2.3335C6.81939 2.3335 2.71533 6.43755 2.71533 11.5002C2.71533 16.5628 6.81939 20.6668 11.882 20.6668Z"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.8818 15.1667V11.5"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.8818 7.8335H11.891"
                stroke={color}
                strokeWidth="1.99832"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default InfoIcon;
