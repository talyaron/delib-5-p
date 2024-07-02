/* eslint-disable indent */
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../model/store';
import { totalMessageBoxesSelector } from '../../../../../../../model/statements/statementsSlice';
import "./message-box-counter.scss"

const MessageBoxCounter = () => {
    const totalMessageBoxes = useSelector((state: RootState) => totalMessageBoxesSelector(state));

    // Disable eslint rule for the next line
    // eslint-disable-next-line no-console
    console.log('Total Message Boxes:', totalMessageBoxes);

    return (
        <div>
            <span className='boxes-counter'>{totalMessageBoxes}</span>
        </div>
    );
};

export default MessageBoxCounter;