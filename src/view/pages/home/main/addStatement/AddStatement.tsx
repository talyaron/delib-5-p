// Third party imports
import { Link } from 'react-router-dom';

// Custom components
import StatementSettings from '@/view/pages/statement/components/settings/StatementSettings';
import BackArrowIcon from '@/assets/icons/chevronLeftIcon.svg?react';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import './AddStatement.scss';

export const AddStatement = () => {
	const { t, dir } = useLanguage();

	return (
		<main className='page'>
			<div className='add-statement-header'>
				<Link
					to={'/home'}
					state={{ from: window.location.pathname }}
					className='back-arrow-icon'
					aria-label='Back to Home page'
				>
					<BackArrowIcon
						style={{
							transform: dir === 'rtl' ? 'rotate(180deg)' : 'rotate(0deg)',
						}}
					/>
				</Link>
				<h1>{t('Add New Group')}</h1>
			</div>
			<main className='page__main'>
				<StatementSettings />
			</main>
		</main>
	);
};

export default AddStatement;
