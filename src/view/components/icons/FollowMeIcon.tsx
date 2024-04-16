import { FC } from "react";

interface Props {
    color: string;
}

const FollowMeIcon: FC<Props> = ({ color = "#4E88C7" }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.8203 17.9133L14.3383 19.4313L12.8203 20.9492"
                stroke={color}
                stroke-width="0.60375"
                stroke-linecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.338 19.4314H9.78418"
                stroke={color}
                stroke-width="0.60375"
                stroke-linecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.8203 3.50024L14.3383 5.0182L12.8203 6.53616"
                stroke={color}
                stroke-width="0.60375"
                stroke-linecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.338 5.01807H9.78418"
                stroke={color}
                stroke-width="0.60375"
                stroke-linecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.6167 11.781L7.32777 7.80538V10.0944H0.749955C0.749955 10.0944 1.4923 10.6425 1.50893 11.781C1.52556 12.9194 0.749955 13.4676 0.749955 13.4676H7.32777V15.3952L10.6167 11.781Z"
                stroke={color}
                stroke-width="0.8625"
                stroke-miterlimit="10"
                stroke-linecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23.25 11.781L19.9611 7.80538V10.0944H13.3833C13.3833 10.0944 14.1256 10.6425 14.1422 11.781C14.1589 12.9194 13.3833 13.4676 13.3833 13.4676H19.9611V15.3952L23.25 11.781Z"
                stroke={color}
                stroke-width="0.8625"
                stroke-miterlimit="10"
                stroke-linecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default FollowMeIcon;
