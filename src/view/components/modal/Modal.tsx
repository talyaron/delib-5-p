import { FC } from 'react'

type Props = {
    children: string | JSX.Element | JSX.Element[]
}

const Modal: FC<Props> = ({ children }) => {
    return (
        <div className='modal'>
            <div className="modal__box">
                {children}
            </div>
        </div>
    )
}

export default Modal