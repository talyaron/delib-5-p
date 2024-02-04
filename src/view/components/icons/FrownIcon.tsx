import { FC } from "react";

interface Props {
    active?: boolean;
}
const FrownIcon: FC<Props> = ({ active = true }) => {
    if (active) {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint0_radial_1057_5610)" fillOpacity="0.5"/>
<path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint1_radial_1057_5610)"/>
<path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint2_radial_1057_5610)"/>
<path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint3_radial_1057_5610)"/>
<path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint4_radial_1057_5610)" fillOpacity="0.5"/>
<path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint5_radial_1057_5610)"/>
<path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint6_radial_1057_5610)"/>
<path d="M6.76281 13.5705C8.69843 13.5705 10.2676 12.0014 10.2676 10.0658C10.2676 8.13016 8.69843 6.56104 6.76281 6.56104C4.82719 6.56104 3.25806 8.13016 3.25806 10.0658C3.25806 12.0014 4.82719 13.5705 6.76281 13.5705Z" fill="url(#paint7_radial_1057_5610)"/>
<path d="M14.433 13.6404C16.1909 13.6404 17.616 12.2153 17.616 10.4574C17.616 8.69949 16.1909 7.27441 14.433 7.27441C12.6751 7.27441 11.25 8.69949 11.25 10.4574C11.25 12.2153 12.6751 13.6404 14.433 13.6404Z" fill="url(#paint8_radial_1057_5610)"/>
<path d="M7.81509 12.1679C8.23339 12.1743 8.64879 12.0975 9.03712 11.9419C9.42545 11.7863 9.77894 11.555 10.077 11.2615C10.3751 10.9679 10.6118 10.618 10.7734 10.2322C10.935 9.84628 11.0182 9.43211 11.0182 9.01376C11.0182 8.59541 10.935 8.18124 10.7734 7.79536C10.6118 7.40948 10.3751 7.05959 10.077 6.76606C9.77894 6.47254 9.42545 6.24123 9.03712 6.08562C8.64879 5.93 8.23339 5.85319 7.81509 5.85964C6.98699 5.87241 6.19712 6.21033 5.61603 6.80046C5.03494 7.39058 4.70923 8.18556 4.70923 9.01376C4.70923 9.84196 5.03494 10.6369 5.61603 11.2271C6.19712 11.8172 6.98699 12.1551 7.81509 12.1679ZM16.1761 12.2256C17.0204 12.2256 17.8301 11.8902 18.4271 11.2932C19.0241 10.6962 19.3595 9.88655 19.3595 9.04226C19.3595 8.19798 19.0241 7.38827 18.4271 6.79128C17.8301 6.19428 17.0204 5.85889 16.1761 5.85889C15.3317 5.85889 14.5219 6.19432 13.9248 6.79139C13.3278 7.38845 12.9923 8.19825 12.9923 9.04264C12.9923 9.88702 13.3278 10.6968 13.9248 11.2939C14.5219 11.891 15.3317 12.2256 16.1761 12.2256Z" fill="white"/>
<path d="M8.25 11.25C8.84674 11.25 9.41903 11.0129 9.84099 10.591C10.2629 10.169 10.5 9.59674 10.5 9C10.5 8.40326 10.2629 7.83097 9.84099 7.40901C9.41903 6.98705 8.84674 6.75 8.25 6.75C7.65326 6.75 7.08097 6.98705 6.65901 7.40901C6.23705 7.83097 6 8.40326 6 9C6 9.59674 6.23705 10.169 6.65901 10.591C7.08097 11.0129 7.65326 11.25 8.25 11.25Z" fill="url(#paint9_linear_1057_5610)"/>
<path d="M15.75 11.25C16.3467 11.25 16.919 11.0129 17.341 10.591C17.7629 10.169 18 9.59674 18 9C18 8.40326 17.7629 7.83097 17.341 7.40901C16.919 6.98705 16.3467 6.75 15.75 6.75C15.1533 6.75 14.581 6.98705 14.159 7.40901C13.7371 7.83097 13.5 8.40326 13.5 9C13.5 9.59674 13.7371 10.169 14.159 10.591C14.581 11.0129 15.1533 11.25 15.75 11.25Z" fill="url(#paint10_linear_1057_5610)"/>
<path d="M7.5 16.5C7.74975 15.9998 9 14.25 12 14.25C15 14.25 16.2502 15.9998 16.5 16.5" stroke="url(#paint11_linear_1057_5610)" strokeWidth="1.5" strokeLinecap="round"/>
<defs>
<radialGradient id="paint0_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(19.1251 6.74969) rotate(132.839) scale(28.1275)">
<stop stopColor="#FFF478"/>
<stop offset="0.475" stopColor="#FFB02E"/>
<stop offset="1" stopColor="#F70A8D"/>
</radialGradient>
<radialGradient id="paint1_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(19.1241 6.75048) rotate(131.878) scale(29.2115)">
<stop stopColor="#FFF478"/>
<stop offset="0.475" stopColor="#FFB02E"/>
<stop offset="1" stopColor="#F70A8D"/>
</radialGradient>
<radialGradient id="paint2_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.5 10.5) rotate(135) scale(30.7591)">
<stop offset="0.315" stopOpacity="0"/>
<stop offset="1"/>
</radialGradient>
<radialGradient id="paint3_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12.7506) rotate(77.692) scale(21.1102)">
<stop offset="0.508" stopColor="#7D6133" stopOpacity="0"/>
<stop offset="1" stopColor="#715B32"/>
</radialGradient>
<radialGradient id="paint4_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.375 12.375) rotate(55.713) scale(9.98512 7.23774)">
<stop stopColor="#FFB849"/>
<stop offset="1" stopColor="#FFB847" stopOpacity="0"/>
</radialGradient>
<radialGradient id="paint5_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.375 13.5) rotate(9.86582) scale(8.75445)">
<stop stopColor="#FFA64B"/>
<stop offset="0.9" stopColor="#FFAE46" stopOpacity="0"/>
</radialGradient>
<radialGradient id="paint6_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.125 11.2502) rotate(43.971) scale(44.2897)">
<stop offset="0.185" stopOpacity="0"/>
<stop offset="1" stopOpacity="0.4"/>
</radialGradient>
<radialGradient id="paint7_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9.48985 7.33874) rotate(135) scale(6.82934 3.53464)">
<stop stopColor="#392108"/>
<stop offset="1" stopColor="#C87928" stopOpacity="0"/>
</radialGradient>
<radialGradient id="paint8_radial_1057_5610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16.9093 7.9811) rotate(135) scale(5.75226 3.24725)">
<stop stopColor="#392108"/>
<stop offset="1" stopColor="#C87928" stopOpacity="0"/>
</radialGradient>
<linearGradient id="paint9_linear_1057_5610" x1="12.375" y1="6" x2="11.625" y2="11.25" gradientUnits="userSpaceOnUse">
<stop stopColor="#553B3E"/>
<stop offset="1" stopColor="#3D2432"/>
</linearGradient>
<linearGradient id="paint10_linear_1057_5610" x1="12.375" y1="6" x2="11.625" y2="11.25" gradientUnits="userSpaceOnUse">
<stop stopColor="#553B3E"/>
<stop offset="1" stopColor="#3D2432"/>
</linearGradient>
<linearGradient id="paint11_linear_1057_5610" x1="12" y1="13.5" x2="12" y2="15" gradientUnits="userSpaceOnUse">
<stop stopColor="#4F3C43"/>
<stop offset="1" stopColor="#512756"/>
</linearGradient>
</defs>
</svg>

        );
    } else {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint0_radial_1057_1116)" fillOpacity="0.2"/>
            <path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint1_radial_1057_1116)" fillOpacity="0.7"/>
            <path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint2_radial_1057_1116)" fillOpacity="0.6"/>
            <path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint3_radial_1057_1116)"/>
            <path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint4_radial_1057_1116)" fillOpacity="0.2"/>
            <path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint5_radial_1057_1116)"/>
            <path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="url(#paint6_radial_1057_1116)"/>
            <path d="M11.9992 22.4985C18.9998 22.4985 22.4985 17.7975 22.4985 11.9985C22.4985 6.201 18.9998 1.5 11.9985 1.5C4.99875 1.5 1.5 6.201 1.5 11.9992C1.5 17.7975 4.998 22.4985 11.9992 22.4985Z" fill="white" fillOpacity="0.4"/>
            <path d="M6.76281 13.5705C8.69843 13.5705 10.2676 12.0014 10.2676 10.0658C10.2676 8.13016 8.69843 6.56104 6.76281 6.56104C4.82719 6.56104 3.25806 8.13016 3.25806 10.0658C3.25806 12.0014 4.82719 13.5705 6.76281 13.5705Z" fill="url(#paint7_radial_1057_1116)"/>
            <path d="M14.433 13.6404C16.1909 13.6404 17.616 12.2153 17.616 10.4574C17.616 8.69949 16.1909 7.27441 14.433 7.27441C12.6751 7.27441 11.25 8.69949 11.25 10.4574C11.25 12.2153 12.6751 13.6404 14.433 13.6404Z" fill="url(#paint8_radial_1057_1116)"/>
            <path d="M7.81509 12.1679C8.23339 12.1743 8.64879 12.0975 9.03712 11.9419C9.42545 11.7863 9.77894 11.555 10.077 11.2615C10.3751 10.9679 10.6118 10.618 10.7734 10.2322C10.935 9.84628 11.0182 9.43211 11.0182 9.01376C11.0182 8.59541 10.935 8.18124 10.7734 7.79536C10.6118 7.40948 10.3751 7.05959 10.077 6.76606C9.77894 6.47254 9.42545 6.24123 9.03712 6.08562C8.64879 5.93 8.23339 5.85319 7.81509 5.85964C6.98699 5.87241 6.19712 6.21033 5.61603 6.80046C5.03494 7.39058 4.70923 8.18556 4.70923 9.01376C4.70923 9.84196 5.03494 10.6369 5.61603 11.2271C6.19712 11.8172 6.98699 12.1551 7.81509 12.1679ZM16.1761 12.2256C17.0204 12.2256 17.8301 11.8902 18.4271 11.2932C19.0241 10.6962 19.3595 9.88655 19.3595 9.04226C19.3595 8.19798 19.0241 7.38827 18.4271 6.79128C17.8301 6.19428 17.0204 5.85889 16.1761 5.85889C15.3317 5.85889 14.5219 6.19432 13.9248 6.79139C13.3278 7.38845 12.9923 8.19825 12.9923 9.04264C12.9923 9.88702 13.3278 10.6968 13.9248 11.2939C14.5219 11.891 15.3317 12.2256 16.1761 12.2256Z" fill="white"/>
            <path d="M7.81509 12.1679C8.23339 12.1743 8.64879 12.0975 9.03712 11.9419C9.42545 11.7863 9.77894 11.555 10.077 11.2615C10.3751 10.9679 10.6118 10.618 10.7734 10.2322C10.935 9.84628 11.0182 9.43211 11.0182 9.01376C11.0182 8.59541 10.935 8.18124 10.7734 7.79536C10.6118 7.40948 10.3751 7.05959 10.077 6.76606C9.77894 6.47254 9.42545 6.24123 9.03712 6.08562C8.64879 5.93 8.23339 5.85319 7.81509 5.85964C6.98699 5.87241 6.19712 6.21033 5.61603 6.80046C5.03494 7.39058 4.70923 8.18556 4.70923 9.01376C4.70923 9.84196 5.03494 10.6369 5.61603 11.2271C6.19712 11.8172 6.98699 12.1551 7.81509 12.1679ZM16.1761 12.2256C17.0204 12.2256 17.8301 11.8902 18.4271 11.2932C19.0241 10.6962 19.3595 9.88655 19.3595 9.04226C19.3595 8.19798 19.0241 7.38827 18.4271 6.79128C17.8301 6.19428 17.0204 5.85889 16.1761 5.85889C15.3317 5.85889 14.5219 6.19432 13.9248 6.79139C13.3278 7.38845 12.9923 8.19825 12.9923 9.04264C12.9923 9.88702 13.3278 10.6968 13.9248 11.2939C14.5219 11.891 15.3317 12.2256 16.1761 12.2256Z" fill="black" fillOpacity="0.2"/>
            <path d="M8.25 11.25C8.84674 11.25 9.41903 11.0129 9.84099 10.591C10.2629 10.169 10.5 9.59674 10.5 9C10.5 8.40326 10.2629 7.83097 9.84099 7.40901C9.41903 6.98705 8.84674 6.75 8.25 6.75C7.65326 6.75 7.08097 6.98705 6.65901 7.40901C6.23705 7.83097 6 8.40326 6 9C6 9.59674 6.23705 10.169 6.65901 10.591C7.08097 11.0129 7.65326 11.25 8.25 11.25Z" fill="url(#paint9_linear_1057_1116)"/>
            <path d="M8.25 11.25C8.84674 11.25 9.41903 11.0129 9.84099 10.591C10.2629 10.169 10.5 9.59674 10.5 9C10.5 8.40326 10.2629 7.83097 9.84099 7.40901C9.41903 6.98705 8.84674 6.75 8.25 6.75C7.65326 6.75 7.08097 6.98705 6.65901 7.40901C6.23705 7.83097 6 8.40326 6 9C6 9.59674 6.23705 10.169 6.65901 10.591C7.08097 11.0129 7.65326 11.25 8.25 11.25Z" fill="white" fillOpacity="0.5"/>
            <path d="M15.75 11.25C16.3467 11.25 16.919 11.0129 17.341 10.591C17.7629 10.169 18 9.59674 18 9C18 8.40326 17.7629 7.83097 17.341 7.40901C16.919 6.98705 16.3467 6.75 15.75 6.75C15.1533 6.75 14.581 6.98705 14.159 7.40901C13.7371 7.83097 13.5 8.40326 13.5 9C13.5 9.59674 13.7371 10.169 14.159 10.591C14.581 11.0129 15.1533 11.25 15.75 11.25Z" fill="url(#paint10_linear_1057_1116)"/>
            <path d="M15.75 11.25C16.3467 11.25 16.919 11.0129 17.341 10.591C17.7629 10.169 18 9.59674 18 9C18 8.40326 17.7629 7.83097 17.341 7.40901C16.919 6.98705 16.3467 6.75 15.75 6.75C15.1533 6.75 14.581 6.98705 14.159 7.40901C13.7371 7.83097 13.5 8.40326 13.5 9C13.5 9.59674 13.7371 10.169 14.159 10.591C14.581 11.0129 15.1533 11.25 15.75 11.25Z" fill="white" fillOpacity="0.5"/>
            <path d="M7.5 16.5C7.74975 15.9998 9 14.25 12 14.25C15 14.25 16.2502 15.9998 16.5 16.5" stroke="url(#paint11_linear_1057_1116)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7.5 16.5C7.74975 15.9998 9 14.25 12 14.25C15 14.25 16.2502 15.9998 16.5 16.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round"/>
            <defs>
            <radialGradient id="paint0_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(19.1251 6.74969) rotate(132.839) scale(28.1275)">
            <stop stopColor="#FFF478"/>
            <stop offset="0.475" stopColor="#FFB02E"/>
            <stop offset="1" stopColor="#F70A8D"/>
            </radialGradient>
            <radialGradient id="paint1_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(19.1241 6.75048) rotate(131.878) scale(29.2115)">
            <stop stopColor="#FFF478"/>
            <stop offset="0.475" stopColor="#FFB02E"/>
            <stop offset="1" stopColor="#F70A8D"/>
            </radialGradient>
            <radialGradient id="paint2_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.5 10.5) rotate(135) scale(30.7591)">
            <stop offset="0.315" stopOpacity="0"/>
            <stop offset="1"/>
            </radialGradient>
            <radialGradient id="paint3_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12.7506) rotate(77.692) scale(21.1102)">
            <stop offset="0.508" stopColor="#7D6133" stopOpacity="0"/>
            <stop offset="1" stopColor="#715B32"/>
            </radialGradient>
            <radialGradient id="paint4_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.375 12.375) rotate(55.713) scale(9.98512 7.23774)">
            <stop stopColor="#FFB849"/>
            <stop offset="1" stopColor="#FFB847" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="paint5_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.375 13.5) rotate(9.86582) scale(8.75445)">
            <stop stopColor="#FFA64B"/>
            <stop offset="0.9" stopColor="#FFAE46" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="paint6_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.125 11.2502) rotate(43.971) scale(44.2897)">
            <stop offset="0.185" stopOpacity="0"/>
            <stop offset="1" stopOpacity="0.4"/>
            </radialGradient>
            <radialGradient id="paint7_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9.48985 7.33874) rotate(135) scale(6.82934 3.53464)">
            <stop stopColor="#392108"/>
            <stop offset="1" stopColor="#C87928" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="paint8_radial_1057_1116" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16.9093 7.9811) rotate(135) scale(5.75226 3.24725)">
            <stop stopColor="#392108"/>
            <stop offset="1" stopColor="#C87928" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="paint9_linear_1057_1116" x1="12.375" y1="6" x2="11.625" y2="11.25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#553B3E"/>
            <stop offset="1" stopColor="#3D2432"/>
            </linearGradient>
            <linearGradient id="paint10_linear_1057_1116" x1="12.375" y1="6" x2="11.625" y2="11.25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#553B3E"/>
            <stop offset="1" stopColor="#3D2432"/>
            </linearGradient>
            <linearGradient id="paint11_linear_1057_1116" x1="12" y1="13.5" x2="12" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F3C43"/>
            <stop offset="1" stopColor="#512756"/>
            </linearGradient>
            </defs>
            </svg>
            
        );
    }
};
export default FrownIcon;
