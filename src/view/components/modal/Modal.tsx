import { FC, ReactNode } from "react";
import "./Modal.scss";

interface Props {
	className?: string;
	children: ReactNode;
	closeModal?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Modal: FC<Props> = ({ children, className = "", closeModal }) => {
	return (
		<div className={`modal ${className}`} onClick={closeModal}>
			<div className="modal-content">{children}</div>
		</div>
	);
};

export default Modal;
