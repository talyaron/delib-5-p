/* eslint-disable indent */
import { FC } from 'react';
import './chat-message-notify.scss';

interface Props {
    count: number;
}

const ChatMessageNotify: FC<Props> = ({ count }) => {
    return (
        <div className="chat-message-notify">
            {count > 0 ? count : ''}
        </div>
    );
};

export default ChatMessageNotify;
