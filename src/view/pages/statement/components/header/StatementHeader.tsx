import React, { FC, useState } from 'react';

// Third party imports
import { Role, Screen, Statement, StatementSubscription } from 'delib-npm';
import { useLocation } from 'react-router-dom';

// Helpers
import toggleNotifications from '@/controllers/db/notifications/notificationsHelpers';

// Redux Store
import { store } from '@/model/store';

// Custom components


// Hooks
import useStatementColor from '@/controllers/hooks/useStatementColor';
import useNotificationPermission from '@/controllers/hooks/useNotificationPermission';
import useToken from '@/controllers/hooks/useToken';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { setFollowMeDB } from '@/controllers/db/statements/setStatements';
import Menu from '@/view/components/menu/Menu';
import MenuOption from '@/view/components/menu/MenuOption';
import Back from './Back';
import InvitePanel from './invitePanel/InvitePanel';

// icons
import InvitationIcon from '@/assets/icons/invitation.svg?react';
import { logOut } from '@/controllers/db/auth';
import StatementTopNav from '../nav/top/StatementTopNav';

interface Props {
	screen: Screen;
	statement: Statement | undefined;
	statementSubscription: StatementSubscription | undefined;
	topParentStatement: Statement | undefined;
	role: Role | undefined;
	showAskPermission: boolean;
	setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatementHeader: FC<Props> = ({
	statement,
	topParentStatement,
	setShowAskPermission,
	role,
}) => {
	// Hooks
	const { pathname } = useLocation();

	const token = useToken();
	const deliberativeElement = statement?.deliberativeElement;
	const isResult = statement?.isResult;
	const headerColor = useStatementColor({ deliberativeElement, isResult });
	const permission = useNotificationPermission(token);
	const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
	const [showInvitationPanel, setShowInvitationPanel] = useState(false);

	const { t, dir } = useLanguage();

	// Redux Store
	const user = store.getState().user.user;
	const isAdmin = statement?.creatorId === user?.uid || role === Role.admin;

	const enableNavigationalElements =
		statement?.statementSettings?.enableNavigationalElements !== undefined
			? statement?.statementSettings?.enableNavigationalElements
			: true;

	function handleShare() {
		const baseUrl = window.location.origin;

		const shareData = {
			title: t('FreeDi: Empowering Agreements'),
			text: t('Invited:') + statement?.statement,
			url: `${baseUrl}${pathname}`,
		};
		navigator.share(shareData);
		setIsHeaderMenuOpen(false);
	}

	async function handleFollowMe() {
		try {
			if (!topParentStatement) throw new Error('No top parent statement');

			await setFollowMeDB(topParentStatement, pathname);
		} catch (error) {
			console.error(error);
		} finally {
			setIsHeaderMenuOpen(false);
		}
	}
	function handleToggleNotifications() {
		toggleNotifications(statement, permission, setShowAskPermission, t);
		setIsHeaderMenuOpen(false);
	}

	function handleInvitePanel() {
		try {
			setShowInvitationPanel(true);
		} catch (error) {
			console.error(error);
		}
	}

	function handleLogout() {
		try {
			logOut();
		} catch (error) {
			console.error(error);
		} finally {
			setIsHeaderMenuOpen(false);
		}
	}


	return (
		<div
			className={`page__header ${dir}`}
			style={{ ...headerColor, direction: dir }}
		>
			<StatementTopNav
				statement={statement}
				handleShare={handleShare}
				handleFollowMe={handleFollowMe}
				handleToggleNotifications={handleToggleNotifications}
				handleInvitePanel={handleInvitePanel}
				handleLogout={handleLogout}
				setIsHeaderMenuOpen={setIsHeaderMenuOpen}
				permission={permission}
				isHeaderMenuOpen={isHeaderMenuOpen}

			/>
			<div className='page__header__wrapper'>
				
			</div>
			{showInvitationPanel && (
				<InvitePanel
					setShowModal={setShowInvitationPanel}
					statementId={statement?.statementId}
					pathname={pathname}
				/>
			)}
		</div>
	);
};

export default StatementHeader;
