import { ComponentProps, FC } from "react";
import "./inviteModal.scss";

type InviteModalProps = ComponentProps<"div">;

const InviteModal: FC<InviteModalProps> = ({ children, className = ""}) => {

	return (
		<div className={`inviteModal ${className}`}>
			<div className="inviteModal__content">{children}</div>
		</div>
	);
};

export default InviteModal;