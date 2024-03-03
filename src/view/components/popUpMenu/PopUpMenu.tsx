import React, { MouseEventHandler } from "react";
import MoreIcon from "../icons/MoreIcon";
import "./popUpStyle.scss";
import QuestionMarkIcon from "../icons/QuestionMarkIcon";
import { useLanguage } from "../../../functions/hooks/useLanguages";

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
    thirdIconFunc?: MouseEventHandler<HTMLSpanElement>;
    thirdIconText?: string;
    fourthIcon?: JSX.Element;
    fourthIconFunc?: MouseEventHandler<HTMLSpanElement>;
    fourthIconText?: string;
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
}: Props) {
    const [openMore, setOpenMore] = React.useState(false);
    const { t } = useLanguage();

    return isAuthrized ? (
        <div
            className="moreIconBox"
            onClick={() => setOpenMore((prev) => !prev)}
        >
            <MoreIcon color={openMoreIconColor} />
            {openMore && (
                <>
                    <div className="invisibleBackground"></div>
                    <div className="moreIconBox__menu">
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
                        <span
                            className="moreIconBox__menu__item"
                            onClick={fourthIconFunc}
                        >
                            {fourthIcon}
                            {t(fourthIconText || "")}
                        </span>
                    </div>
                </>
            )}
        </div>
    ) : (
        unAuthrizedIcon
    );
}
