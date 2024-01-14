import { User } from "delib-npm";
import { FC } from "react";
import styles from "./Chip.module.scss";
import SmileIcon from "../../../assets/icons/SmileIcon";

// import anonymous from "../../../assets/anonymous1.png";

interface Props {
    user: User | undefined;
}
const Chip: FC<Props> = ({ user }) => {
    if (!user) return null;
    const displayName = user.displayName.slice(0, 15);

    return (
        <div className={styles.chip}>
            {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} />
            ) : (
                <SmileIcon color="lightgray" />
            )}
            <span>{displayName}</span>
        </div>
    );
};

export default Chip;
