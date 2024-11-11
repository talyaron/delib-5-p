import { ComponentProps, FC } from 'react';
import './Modal.scss';

type ModalProps = ComponentProps<'div'>;

const Modal: FC<ModalProps> = ({ children, className = '' }) => {
	return (
		<div className={`modal ${className}`}>
			<div className="modal-content">{children}</div>
		</div>
	);
};

export default Modal;
