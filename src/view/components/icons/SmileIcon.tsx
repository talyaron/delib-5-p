import { FC } from "react";

interface Props {
    active?: boolean;
}
const SmileIcon: FC<Props> = ({ active = true }) => {
    if (active) {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <mask
                    id="mask0_1057_11981"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <path
                        d="M0 0L24 5.24095e-09L24 24L5.33054e-09 24L0 0Z"
                        fill="white"
                    />
                </mask>
                <g mask="url(#mask0_1057_11981)">
                    <path
                        d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint0_radial_1057_11981)"
                    />
                    <path
                        d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint1_radial_1057_11981)"
                    />
                    <path
                        d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint2_radial_1057_11981)"
                    />
                    <path
                        d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint3_radial_1057_11981)"
                    />
                    <path
                        d="M11.9992 22.4985C18.9997 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint4_radial_1057_11981)"
                    />
                    <path
                        d="M6 9.75C6 9.75 6.1875 8.25 7.875 8.25C9.5625 8.25 9.75 9.75 9.75 9.75"
                        stroke="#43273B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <g opacity="0.26" filter="url(#filter0_f_1057_11981)">
                        <path
                            d="M6.1875 9.5625C6.1875 9.5625 6.375 8.0625 8.0625 8.0625C9.75 8.0625 9.9375 9.5625 9.9375 9.5625"
                            stroke="white"
                            strokeWidth="0.5625"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                    <path
                        d="M14.25 9.75C14.25 9.75 14.625 8.25 16.125 8.25C17.625 8.25 18 9.75 18 9.75"
                        stroke="#43273B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <g opacity="0.26" filter="url(#filter1_f_1057_11981)">
                        <path
                            d="M14.4375 9.5625C14.4375 9.5625 14.625 8.0625 16.3125 8.0625C18 8.0625 18.1875 9.5625 18.1875 9.5625"
                            stroke="white"
                            strokeWidth="0.5625"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                    <path
                        d="M4.875 7.125C5.12475 6.375 6.075 4.875 7.875 4.875"
                        stroke="url(#paint5_linear_1057_11981)"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M19.125 7.125C18.8752 6.375 17.925 4.875 16.125 4.875"
                        stroke="url(#paint6_linear_1057_11981)"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7.5 14.25C7.875 14.7502 9.375 16.125 12 16.125C14.625 16.125 16.125 14.7502 16.5 14.25"
                        stroke="url(#paint7_radial_1057_11981)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </g>
                <defs>
                    <filter
                        id="filter0_f_1057_11981"
                        x="4.78125"
                        y="6.65625"
                        width="6.5625"
                        height="4.3125"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                        />
                        <feGaussianBlur
                            stdDeviation="0.5625"
                            result="effect1_foregroundBlur_1057_11981"
                        />
                    </filter>
                    <filter
                        id="filter1_f_1057_11981"
                        x="13.0312"
                        y="6.65625"
                        width="6.5625"
                        height="4.3125"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                        />
                        <feGaussianBlur
                            stdDeviation="0.5625"
                            result="effect1_foregroundBlur_1057_11981"
                        />
                    </filter>
                    <radialGradient
                        id="paint0_radial_1057_11981"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(19.1241 6.75048) rotate(131.878) scale(29.2115)"
                    >
                        <stop stopColor="#FFF478" />
                        <stop offset="0.475" stopColor="#FFB02E" />
                        <stop offset="1" stopColor="#F70A8D" />
                    </radialGradient>
                    <radialGradient
                        id="paint1_radial_1057_11981"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(11.9995 9.37479) rotate(101.31) scale(13.3849 17.1436)"
                    >
                        <stop
                            offset="0.788"
                            stopColor="#F59639"
                            stopOpacity="0"
                        />
                        <stop offset="0.973" stopColor="#FF7DCE" />
                    </radialGradient>
                    <radialGradient
                        id="paint2_radial_1057_11981"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(13.5 10.5) rotate(135) scale(30.7591)"
                    >
                        <stop offset="0.315" stopOpacity="0" />
                        <stop offset="1" />
                    </radialGradient>
                    <radialGradient
                        id="paint3_radial_1057_11981"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(12 12.7506) rotate(77.692) scale(21.1102)"
                    >
                        <stop
                            offset="0.508"
                            stopColor="#7D6133"
                            stopOpacity="0"
                        />
                        <stop offset="1" stopColor="#715B32" />
                    </radialGradient>
                    <radialGradient
                        id="paint4_radial_1057_11981"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(12.375 12.375) rotate(55.713) scale(9.98512 7.23774)"
                    >
                        <stop stopColor="#FFB849" />
                        <stop
                            offset="1"
                            stopColor="#FFB847"
                            stopOpacity="0"
                        />
                    </radialGradient>
                    <linearGradient
                        id="paint5_linear_1057_11981"
                        x1="5.12475"
                        y1="7.8"
                        x2="5.12475"
                        y2="6.45"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0.03" stopColor="#524049" />
                        <stop offset="1" stopColor="#4A2C42" />
                    </linearGradient>
                    <linearGradient
                        id="paint6_linear_1057_11981"
                        x1="18.8752"
                        y1="7.8"
                        x2="18.8752"
                        y2="6.45"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0.03" stopColor="#524049" />
                        <stop offset="1" stopColor="#4A2C42" />
                    </linearGradient>
                    <radialGradient
                        id="paint7_radial_1057_11981"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(13.4055 12.69) rotate(90) scale(8.61712)"
                    >
                        <stop offset="0.103" stopColor="#482641" />
                        <stop offset="0.299" stopColor="#503A4A" />
                        <stop offset="0.556" stopColor="#483637" />
                    </radialGradient>
                </defs>
            </svg>
        );
    } else {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <mask
                    id="mask0_1057_12458"
                    style={{ maskType: 'luminance' }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <path
                        d="M0 0L24 5.24095e-09L24 24L5.33054e-09 24L0 0Z"
                        fill="white"
                    />
                </mask>
                <g mask="url(#mask0_1057_12458)">
                    <path
                        d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint0_radial_1057_12458)"
                        fillOpacity="0.7"
                    />
                    <path
                        d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint1_radial_1057_12458)"
                    />
                    <path
                        d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint2_radial_1057_12458)"
                        fillOpacity="0.6"
                    />
                    <path
                        d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint3_radial_1057_12458)"
                    />
                    <path
                        d="M11.9992 22.4985C18.9997 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="url(#paint4_radial_1057_12458)"
                    />
                    <path
                        d="M11.9992 22.4985C18.9997 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z"
                        fill="white"
                        fillOpacity="0.4"
                    />
                    <path
                        d="M6 9.75C6 9.75 6.1875 8.25 7.875 8.25C9.5625 8.25 9.75 9.75 9.75 9.75"
                        stroke="#43273B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M6 9.75C6 9.75 6.1875 8.25 7.875 8.25C9.5625 8.25 9.75 9.75 9.75 9.75"
                        stroke="white"
                        strokeOpacity="0.4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <g opacity="0.26" filter="url(#filter0_f_1057_12458)">
                        <path
                            d="M6.1875 9.5625C6.1875 9.5625 6.375 8.0625 8.0625 8.0625C9.75 8.0625 9.9375 9.5625 9.9375 9.5625"
                            stroke="white"
                            strokeWidth="0.5625"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                    <path
                        d="M14.25 9.75C14.25 9.75 14.625 8.25 16.125 8.25C17.625 8.25 18 9.75 18 9.75"
                        stroke="#43273B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M14.25 9.75C14.25 9.75 14.625 8.25 16.125 8.25C17.625 8.25 18 9.75 18 9.75"
                        stroke="white"
                        strokeOpacity="0.4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <g opacity="0.26" filter="url(#filter1_f_1057_12458)">
                        <path
                            d="M14.4375 9.5625C14.4375 9.5625 14.625 8.0625 16.3125 8.0625C18 8.0625 18.1875 9.5625 18.1875 9.5625"
                            stroke="white"
                            strokeWidth="0.5625"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                    <path
                        d="M4.875 7.125C5.12475 6.375 6.075 4.875 7.875 4.875"
                        stroke="url(#paint5_linear_1057_12458)"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M4.875 7.125C5.12475 6.375 6.075 4.875 7.875 4.875"
                        stroke="white"
                        strokeOpacity="0.4"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M19.125 7.125C18.8752 6.375 17.925 4.875 16.125 4.875"
                        stroke="url(#paint6_linear_1057_12458)"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M19.125 7.125C18.8752 6.375 17.925 4.875 16.125 4.875"
                        stroke="white"
                        strokeOpacity="0.4"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7.5 14.25C7.875 14.7502 9.375 16.125 12 16.125C14.625 16.125 16.125 14.7502 16.5 14.25"
                        stroke="url(#paint7_radial_1057_12458)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M7.5 14.25C7.875 14.7502 9.375 16.125 12 16.125C14.625 16.125 16.125 14.7502 16.5 14.25"
                        stroke="#FFFBFB"
                        strokeOpacity="0.4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </g>
                <defs>
                    <filter
                        id="filter0_f_1057_12458"
                        x="4.78125"
                        y="6.65625"
                        width="6.5625"
                        height="4.3125"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                        />
                        <feGaussianBlur
                            stdDeviation="0.5625"
                            result="effect1_foregroundBlur_1057_12458"
                        />
                    </filter>
                    <filter
                        id="filter1_f_1057_12458"
                        x="13.0312"
                        y="6.65625"
                        width="6.5625"
                        height="4.3125"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                        />
                        <feGaussianBlur
                            stdDeviation="0.5625"
                            result="effect1_foregroundBlur_1057_12458"
                        />
                    </filter>
                    <radialGradient
                        id="paint0_radial_1057_12458"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(19.1241 6.75048) rotate(131.878) scale(29.2115)"
                    >
                        <stop stopColor="#FFF478" />
                        <stop offset="0.475" stopColor="#FFB02E" />
                        <stop offset="1" stopColor="#F70A8D" />
                    </radialGradient>
                    <radialGradient
                        id="paint1_radial_1057_12458"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(11.9995 9.37479) rotate(101.31) scale(13.3849 17.1436)"
                    >
                        <stop
                            offset="0.788"
                            stopColor="#F59639"
                            stopOpacity="0"
                        />
                        <stop offset="0.973" stopColor="#FF7DCE" />
                    </radialGradient>
                    <radialGradient
                        id="paint2_radial_1057_12458"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(13.5 10.5) rotate(135) scale(30.7591)"
                    >
                        <stop offset="0.315" stopOpacity="0" />
                        <stop offset="1" />
                    </radialGradient>
                    <radialGradient
                        id="paint3_radial_1057_12458"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(12 12.7506) rotate(77.692) scale(21.1102)"
                    >
                        <stop
                            offset="0.508"
                            stopColor="#7D6133"
                            stopOpacity="0"
                        />
                        <stop offset="1" stopColor="#715B32" />
                    </radialGradient>
                    <radialGradient
                        id="paint4_radial_1057_12458"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(12.375 12.375) rotate(55.713) scale(9.98512 7.23774)"
                    >
                        <stop stopColor="#FFB849" />
                        <stop offset="1" stopColor="#FFB847" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient
                        id="paint5_linear_1057_12458"
                        x1="5.12475"
                        y1="7.8"
                        x2="5.12475"
                        y2="6.45"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0.03" stopColor="#524049" />
                        <stop offset="1" stopColor="#4A2C42" />
                    </linearGradient>
                    <linearGradient
                        id="paint6_linear_1057_12458"
                        x1="18.8752"
                        y1="7.8"
                        x2="18.8752"
                        y2="6.45"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0.03" stopColor="#524049" />
                        <stop offset="1" stopColor="#4A2C42" />
                    </linearGradient>
                    <radialGradient
                        id="paint7_radial_1057_12458"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(13.4055 12.69) rotate(90) scale(8.61712)"
                    >
                        <stop offset="0.103" stopColor="#482641" />
                        <stop offset="0.299" stopColor="#503A4A" />
                        <stop offset="0.556" stopColor="#483637" />
                    </radialGradient>
                </defs>
            </svg>
        );
    }
};
export default SmileIcon;
