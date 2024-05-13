import { Link } from 'react-router-dom'
import styles from './unAuthorizedPage.module.scss'
import unAuthImage from '../../../assets/images/secure-private-by-design.svg';

const UnAuthorizedPage = () => {
    return (
        <div className={styles.page}>
            <Link to='/home'>
                <div className={styles.box}>
                    <h1>Page Not Authorized</h1>
                    <img src={unAuthImage} alt="401 - unauthorized page" />
                    <h2>Please go to main Page</h2>
                </div>
            </Link>
        </div>
    )
}

export default UnAuthorizedPage