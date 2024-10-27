import { Link } from 'react-router-dom';
import './unAuthorizedPage.scss';
import unAuthImage from '@/assets/images/secure-private-by-design.svg';

const UnAuthorizedPage = () => {
	return (
		<main className='page unAuth'>
			<h1>Page Not Authorized</h1>
			<img src={unAuthImage} alt='401 - unauthorized page' />
			<Link to='/home'>Please go to main Page</Link>
		</main>
	);
};

export default UnAuthorizedPage;
