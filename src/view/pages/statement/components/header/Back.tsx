import { Statement } from 'delib-npm';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/controllers/db/config';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrowIcon from '@/assets/icons/chevronLeftIcon.svg?react';
import { StyleProps } from '@/controllers/hooks/useStatementColor';
import { historySelect, HistoryTracker } from '@/model/history/HistorySlice';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';

interface Props {
	statement: Statement | undefined;
	headerColor: StyleProps;
}

const Back: FC<Props> = ({ statement, headerColor }) => {
	const navigate = useNavigate();
	const topParentHistory: HistoryTracker | undefined = useAppSelector(
		historySelect(statement?.parentId || '')
	);

	function handleBack() {
		try {
			//google analytics log
			logEvent(analytics, 'statement_back_button', {
				button_category: 'buttons',
				button_label: 'back_button',
			});

			//rules: if history exits --> go back in history

			//in case the back should direct to home

			if (statement?.parentId === 'top' || !statement?.parentId) {
				return navigate('/home', {
					state: { from: window.location.pathname },
				});
			}

			if (topParentHistory === undefined) {
				return navigate(`/statement/${statement?.parentId}/chat`, {
					state: { from: window.location.pathname },
				});
			}

			if (!topParentHistory || !statement)
				return navigate('/home', {
					state: { from: window.location.pathname },
				});

			return navigate(topParentHistory.pathname, {
				state: { from: window.location.pathname },
			});
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<button
			className="page__header__wrapper__actions__iconButton"
			aria-label="Back Button"
			onClick={handleBack}
			style={{ cursor: 'pointer' }}
			data-cy="back-icon-header"
		>
			<BackArrowIcon
				className="back-arrow-icon"
				style={{
					color: headerColor.color,
				}}
			/>
		</button>
	);
};

export default Back;
