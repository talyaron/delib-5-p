import { Statement } from 'delib-npm';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrowIcon from '@/assets/icons/chevronLeftIcon.svg?react';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import { StyleProps } from '@/controllers/hooks/useStatementColor';
import { historySelect, HistoryTracker } from '@/model/history/HistorySlice';

interface Props {
	statement: Statement | undefined;
	headerColor: StyleProps;
}

const Back: FC<Props> = ({ statement, headerColor }) => {
	const navigate = useNavigate();
	const topParentHistory: HistoryTracker | undefined = useAppSelector(
		historySelect(statement?.parentId ?? '')
	);

	function handleBack() {
		try {
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
			className='page__header__wrapper__actions__iconButton'
			aria-label='Back Button'
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
