import { useEffect, useState } from 'react';

// Third party imports
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

// Firebase functions
import { listenToAuth, logOut } from './controllers/db/auth';
import { Unsubscribe } from 'firebase/auth';

// Redux Store
import { useAppSelector } from './controllers/hooks/reduxHooks';
import { useDispatch } from 'react-redux';
import { updateAgreementToStore, userSelector } from './model/users/userSlice';

// Type
import { Agreement } from 'delib-npm';

// Custom components
import Accessibility from './view/components/accessibility/Accessibility';
import TermsOfUse from './view/components/termsOfUse/TermsOfUse';

// Helpers
import { updateUserAgreement } from './controllers/db/users/setUsersDB';
import { getSignature } from './controllers/db/users/getUserDB';
import {
	listenToInAppNotifications,
	onLocalMessage,
} from './controllers/db/notifications/notifications';
import { LanguagesEnum, useLanguage } from './controllers/hooks/useLanguages';
import { selectInitLocation } from './model/location/locationSlice';
import { setHistory } from './model/history/HistorySlice';
import { listenToVersionFromDB } from './controllers/db/version/getVersion';

export default function App() {
	// Hooks
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { statementId, anonymous } = useParams();
	const { changeLanguage, t } = useLanguage();

	// Redux Store
	const user = useAppSelector(userSelector);
	const initLocation = useAppSelector(selectInitLocation);

	// Use State
	const [showSignAgreement, setShowSignAgreement] = useState(false);
	const [agreement, setAgreement] = useState<string>('');
	useEffect(() => {
		// Default direction is ltr
		document.body.style.direction = 'ltr';

		// Get language from local storage and change accordingly
		const lang = localStorage.getItem('lang') as LanguagesEnum;
		if (lang) {
			changeLanguage(lang);
			document.body.style.direction =
				lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr';
		}
	}, []);

	useEffect(() => {
		const authUnsubscribe: Unsubscribe = listenToAuth(dispatch)(
			anonymous === 'true',
			navigate,
			initLocation
		);

		return () => authUnsubscribe();
	}, []);

	useEffect(() => {
		const unsubscribeToVersion = listenToVersionFromDB();

		return () => unsubscribeToVersion();
	}, []);

	useEffect(() => {
		dispatch(setHistory({ statementId, pathname: location.pathname }));
	}, [location]);

	useEffect(() => {
		const fetchData = async () => {
			if (!user) {
				return;
			}

			const unsubscribeToLocalMessages = await onLocalMessage();

			if (user.agreement?.date) {
				setShowSignAgreement(false);
			} else {
				const agreement = getSignature('basic', t);

				if (!agreement) throw new Error('agreement not found');

				setAgreement(agreement.text);
				setShowSignAgreement(true);
			}

			return unsubscribeToLocalMessages;
		};

		return () => {
			fetchData();
		};
	}, [user]);

	useEffect(() => {
		if (!user) {
			return;
		}

		const unsubscribeToInAppNotifications = listenToInAppNotifications();

		if (user.agreement?.date) {
			setShowSignAgreement(false);
		} else {
			const agreement = getSignature('basic', t);

			if (!agreement) throw new Error('agreement not found');

			setAgreement(agreement.text);
			setShowSignAgreement(true);
		}

		return () => {
			return unsubscribeToInAppNotifications();
		};
	}, [user]);

	async function handleAgreement(agree: boolean, text: string) {
		try {
			if (!text) throw new Error('text is empty');
			if (agree) {
				setShowSignAgreement(false);
				const agreement: Agreement | undefined = getSignature('basic', t);
				if (!agreement) throw new Error('agreement not found');
				agreement.text = text;

				dispatch(updateAgreementToStore(agreement));

				updateUserAgreement(agreement).then((isAgreed: boolean) =>
					setShowSignAgreement(!isAgreed)
				);
			} else {
				setShowSignAgreement(false);
				await logOut();
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div>
			<Accessibility />

			<Outlet />
			{showSignAgreement && (
				<TermsOfUse handleAgreement={handleAgreement} agreement={agreement} />
			)}
		</div>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const install: { deferredPrompt: any } = {
// 	deferredPrompt: {} as Event,
// };
