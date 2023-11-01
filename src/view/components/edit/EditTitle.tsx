import { Statement } from 'delib-npm';
import { FC } from 'react';
import { updateStatementText } from '../../../functions/db/statements/setStatments';
import styles from './EditTitle.module.scss';

interface Props {
    statement: Statement | undefined;
    setEdit: Function;
    isTextArea?: boolean;
}

const EditTitle: FC<Props> = ({ statement, setEdit,isTextArea }) => {
    try {

        if (!statement) return null;

        const title = statement.statement.split('\n')[0];
        const description = statement.statement.split('\n').slice(1).join('\n');

        function handleSetTitle(e: any) {
            try {
                if (e.type === 'blur' || (e.key === 'Enter' && e.shiftKey === false)) {
                    const _title = e.target.value;
                    if (_title === title) return;
                    if (!_title) return;


                    if (!statement) throw new Error('statement is undefined');

                    //join title and description
                    const _statement = _title + '\n' + description;
                    //update title in db
                    updateStatementText(statement, _statement);

                    setEdit(false);
                }
            } catch (error) {
                console.error(error);

            }
        }

        if(isTextArea) return (
            <textarea className={styles.input} defaultValue={title} onBlur={handleSetTitle} onKeyUp={handleSetTitle} />
        )

        return (
            <input className={styles.input} type="text" defaultValue={title} onBlur={handleSetTitle} onKeyUp={handleSetTitle} />
        )
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default EditTitle