import { ComponentProps, FC } from "react";
import styles from "./IconButton.module.scss";

const IconButton: FC<ComponentProps<"button">> = (props) => {
    return <button className={styles.iconButton} {...props} />;
};

export default IconButton;
