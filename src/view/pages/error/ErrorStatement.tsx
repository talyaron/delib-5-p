
import { Link } from 'react-router-dom';
import styles from './ErrorStatement.module.scss';

const ErrorStatement = () => {
    return (
        <div className={styles.errorPage}>
            <h1>Error: Statement not found</h1>
            <p>We're sorry, but the requested statement could not be found.</p>
            <Link to="/home"><div className="btn btn--agree btn--large"> Return to home</div></Link>
        </div>
    );
};

export default ErrorStatement;