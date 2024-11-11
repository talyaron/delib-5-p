import GoogleLoginButton from '../../components/buttons/GoogleLoginButton';
import image from '@/assets/images/loginFirstImage.png';
import './LoginFirst.scss';

export default function LoginPage() {
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

	// const cameFrom = location.state.from ? location.state.from : "/";

	return (
		<div className="login-first">
			<div className="content-container">
				<img
					src={image}
					alt="login-first-image"
					width={isMobile ? '100%' : '50%'}
				/>
				<p>In order to continue you have to login</p>
				<GoogleLoginButton />
			</div>
		</div>
	);
}
