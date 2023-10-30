import { Statement } from 'delib-npm';
import { FC } from 'react';
import Text from '../../../../components/text/Text';
import styles from './Document.module.scss';

interface Props {
    statement: Statement
}

const Document: FC<Props> = ({ statement }) => {
    //get the statment 2nd paragraph and all followoing paragraphs
    const description = statement.statement.split('\n').slice(1).join('\n');
    return (
        <div className='page__main'>
            <div className="wrapper">
                <div className={styles.document}>
                    <h2><Text text={statement.statement} onlyTitle={true} /></h2>
                    <p><Text text={description} /></p>

                </div>
                <section className={styles.results}>
                    <h2>תוצאות</h2>
                </section>
            </div>
        </div>
    )
}

export default Document