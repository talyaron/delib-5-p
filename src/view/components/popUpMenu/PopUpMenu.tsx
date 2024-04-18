import React, { MouseEventHandler } from "react";
import EllipsisIcon from "../../../assets/icons/ellipsisIcon.svg?react";
import "./popUpStyle.scss";
import QuestionMarkIcon from "../icons/QuestionMarkIcon";
import { useLanguage } from "../../../functions/hooks/useLanguages";
import IconButton from "../iconButton/IconButton";
import { Role } from "delib-npm";
import { isAdmin } from "../../../functions/general/helpers";

interface Props {
    isAuthrized?: boolean;
    unAuthrizedIcon?: JSX.Element;
    openMoreIconColor: string;
    firstIcon: JSX.Element;
    firstIconFunc?: MouseEventHandler<HTMLSpanElement>;
    firstIconText: string;
    secondIcon?: JSX.Element;
    secondIconFunc?: MouseEventHandler<HTMLSpanElement>;
    secondIconText?: string;
    thirdIcon?: JSX.Element;
    thirdIconFunc?: any; // MouseEventHandler<HTMLSpanElement>;
    thirdIconText?: string;
    fourthIcon?: JSX.Element;
    fourthIconFunc?: React.MouseEventHandler<HTMLSpanElement>; // MouseEventHandler<HTMLSpanElement>;
    fourthIconText?: string;
    role?: Role | undefined;
}

export default function PopUpMenu({
    isAuthrized = true,
    openMoreIconColor,
    unAuthrizedIcon = <QuestionMarkIcon color={openMoreIconColor} />,
    firstIcon,
    firstIconFunc,
    firstIconText,
    secondIcon,
    secondIconFunc,
    secondIconText,
    thirdIcon,
    thirdIconFunc,
    thirdIconText,
    fourthIcon,
    fourthIconFunc,
    fourthIconText,
    role,
}: Props) {
    const [openMore, setOpenMore] = React.useState(false);
    const { t, dir } = useLanguage();

    return isAuthrized ? (
        <div
            className="moreIconBox"
            onClick={() => setOpenMore((prev) => !prev)}
        >
            <IconButton>
                <EllipsisIcon style={{ color: openMoreIconColor }} />
            </IconButton>
            {openMore && (
                <>
                    <div className="invisibleBackground"></div>
                    <div className="moreIconBox__menu" style={{right:dir==="rtl"?"-12rem":"0"}}>
                        <span
                            className="moreIconBox__menu__item"
                            onClick={firstIconFunc}
                        >
                            {firstIcon}
                            {t(firstIconText)}
                        </span>
                        <span
                            className="moreIconBox__menu__item"
                            onClick={secondIconFunc}
                        >
                            {secondIcon}
                            {t(secondIconText || "")}
                        </span>
                        <span
                            className="moreIconBox__menu__item"
                            onClick={thirdIconFunc}
                        >
                            {thirdIcon}
                            {t(thirdIconText || "")}
                        </span>
                        {isAdmin(role) && (
                            <span
                                className="moreIconBox__menu__item"
                                onClick={fourthIconFunc}
                            >
                                {fourthIcon}
                                {t(fourthIconText || "")}
                            </span>
                        )}  
                    </div>
                </>
            )}
        </div>
    ) : (
        unAuthrizedIcon
    );
}
