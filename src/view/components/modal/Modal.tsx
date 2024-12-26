import { FC, ReactNode } from "react";
import "./Modal.scss";

interface Props {
	className?: string;
	children: ReactNode;
	closeModal?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Modal: FC<Props> = ({ children, className = "", closeModal }) => {

	const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	return (
		<div className={`modal ${className}`} onClick={closeModal}>
			<div className="modal-content" onClick={handleContentClick}>
				{children}
			</div>
		</div>
	);
};

export default Modal;
