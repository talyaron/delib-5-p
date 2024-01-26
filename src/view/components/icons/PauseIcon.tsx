import React from "react";
import { actionCircleStyle } from "./PlayIcon";

interface Props {
    onClick: () => void;
}

export default function PauseIcon({ onClick }: Props) {
    return (
        <div style={actionCircleStyle} onClick={onClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.857 23.1445C13.857 24.6112 12.657 25.8112 11.1903 25.8112C9.72365 25.8112 8.52365 24.6112 8.52365 23.1445L8.52365 9.8112C8.52365 8.34453 9.72365 7.14453 11.1903 7.14453C12.657 7.14453 13.857 8.34453 13.857 9.8112L13.857 23.1445ZM19.1903 23.1445L19.1903 9.8112C19.1903 8.34453 20.3903 7.14453 21.857 7.14453C23.3237 7.14453 24.5237 8.34453 24.5237 9.8112L24.5237 23.1445C24.5237 24.6112 23.3237 25.8112 21.857 25.8112C20.3903 25.8112 19.1903 24.6112 19.1903 23.1445Z"
                    fill="#226CBC"
                />
            </svg>
        </div>
    );
}
