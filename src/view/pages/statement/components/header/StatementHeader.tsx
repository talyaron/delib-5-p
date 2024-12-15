import React, { FC, useState } from 'react';

// Third party imports
import { Role, Screen, Statement, StatementSubscription } from 'delib-npm';
import { useLocation } from 'react-router-dom';

// Helpers
import toggleNotifications from '@/controllers/db/notifications/notificationsHelpers';

// Hooks

import useNotificationPermission from '@/controllers/hooks/useNotificationPermission';
import useToken from '@/controllers/hooks/useToken';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { setFollowMeDB } from '@/controllers/db/statements/setStatements';
import InvitePanel from './invitePanel/InvitePanel';

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
}) => {
	// Hooks
	const { pathname } = useLocation();

	const token = useToken();

	const permission = useNotificationPermission(token);
	const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
	const [showInvitationPanel, setShowInvitationPanel] = useState(false);

	const { t, dir } = useLanguage();

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

	async function handleLogout() {
		try {
			setIsHeaderMenuOpen(false);
			await logOut();
		} catch (error) {
			console.error(error);
		} 
	}

	return (
		<div className={`page__header ${dir}`}>
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