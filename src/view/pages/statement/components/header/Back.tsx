import { Screen, Statement } from 'delib-npm';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/controllers/db/config';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrowIcon from '@/assets/icons/chevronLeftIcon.svg?react';
import { getFirstScreen } from '@/controllers/general/helpers';
import { StyleProps } from '@/controllers/hooks/useStatementColor';
import { historySelect } from '@/model/history/HistorySlice';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';

interface Props {
	parentStatement: Statement | undefined;
	statement: Statement | undefined;
	headerColor: StyleProps;
}

const Back: FC<Props> = ({ parentStatement, statement, headerColor }) => {
	const navigate = useNavigate();

	const parentStatementLastSubScreen = useAppSelector(
		historySelect(parentStatement?.statementId || '')
	);

	const parentStatementScreens = parentStatement?.subScreens || [
		Screen.QUESTIONS,
		Screen.CHAT,
		Screen.HOME,
		Screen.VOTE,
		Screen.OPTIONS,
	];
	function handleBack() {
		try {
			//google analytics log
			logEvent(analytics, 'statement_back_button', {
				button_category: 'buttons',
				button_label: 'back_button',
			});

			//rules: if history exits --> go back in history

			//in case the back should direct to home
			if (statement?.parentId === 'top') {
				return navigate('/home', {
					state: { from: window.location.pathname },
				});
			}

			if (parentStatementLastSubScreen) {
				console.info(
					`Navigate to ${parentStatement?.statement} sub screen: ${parentStatementLastSubScreen}`
				);

				return navigate(
					`/statement/${statement?.parentId}/${parentStatementLastSubScreen}`,
					{
						state: { from: window.location.pathname },
					}
				);
			}

			//in case the back should direct to the parent statement, go to the parent statement in the order of the parentStatementScreens: home, questions, options, chat, vote
			const firstScreen: Screen = getFirstScreen(parentStatementScreens);

			return navigate(`/statement/${statement?.parentId}/${firstScreen}`, {
				state: { from: window.location.pathname },
			});
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<button
			className='page__header__wrapper__actions__iconButton'
			aria-label="Back Button"
			onClick={handleBack}
			style={{ cursor: 'pointer' }}
			data-cy='back-icon-header'
		>
			<BackArrowIcon
				className='back-arrow-icon'
				style={{
					color: headerColor.color,
				}}
			/>
		</button>
	);
};

export default Back;
