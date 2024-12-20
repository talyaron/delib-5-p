/* eslint-disable indent */
import { useSelector } from 'react-redux';
import { totalMessageBoxesSelector } from '@/model/statements/statementsSlice';
import { RootState } from '@/model/store';
import "./message-box-counter.scss"

const MessageBoxCounter = () => {
    const totalMessageBoxes = useSelector((state: RootState) => totalMessageBoxesSelector(state));

    // Disable eslint rule for the next line
    // eslint-disable-next-line no-console

    return (
        <div>
            <span className='boxes-counter'>{totalMessageBoxes}</span>
        </div>
    );
};

export default MessageBoxCounter;