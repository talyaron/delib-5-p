import { ComponentProps, FC } from "react";
import "./IconButton.scss";

const IconButton: FC<ComponentProps<"button">> = ({ className, ...props }) => {
    return <button className={`icon-button ${className}`} {...props} />;
};

export default IconButton;
