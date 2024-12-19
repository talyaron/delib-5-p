import { FC } from 'react';
import styles from './StatementTopNav.module.scss';
// Third party imports
import { Role, Statement } from 'delib-npm';

// Helpers
import useStatementColor from '@/controllers/hooks/useStatementColor.ts';

//icons
import Chat from '@/assets/icons/chatTop.svg?react';
import BellIcon from '@/assets/icons/bellIcon.svg?react';
import BellSlashIcon from '@/assets/icons/bellSlashIcon.svg?react';
import View from '@/assets/icons/view.svg?react';
import InvitationIcon from '@/assets/icons/invitation.svg?react';
import FollowMe from '@/assets/icons/follow.svg?react';
import ShareIcon from '@/assets/icons/shareIcon.svg?react';
import DisconnectIcon from '@/assets/icons/disconnectIcon.svg?react';
import SettingsIcon from '@/assets/icons/settings.svg?react';
import MainIcon from '@/assets/icons/evaluations2Icon.svg?react';

//components
import Back from '../../header/Back';
import HomeButton from '../../header/HomeButton';
import { useSelector } from 'react-redux';
import { statementSubscriptionSelector } from '@/model/statements/statementsSlice';
import Menu from '@/view/components/menu/Menu';
import MenuOption from '@/view/components/menu/MenuOption';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
	statement?: Statement;
	handleShare: () => void;
	handleFollowMe: () => void;
	handleToggleNotifications: () => void;
	handleInvitePanel: () => void;
	handleLogout: () => void;
	setIsHeaderMenuOpen: (value: boolean) => void;
	isHeaderMenuOpen: boolean;
	permission: boolean;
}

const StatementTopNav: FC<Props> = ({
	statement,
	setIsHeaderMenuOpen,
	handleToggleNotifications,
	handleLogout,
	handleFollowMe,
	handleInvitePanel,
	permission,
	isHeaderMenuOpen,
	handleShare,
}) => {
	//hooks
	const { t } = useLanguage();
	const navigate = useNavigate();
	const { command } = useParams();

	// const
	const deliberativeElement = statement?.deliberativeElement;
	const isResult = statement?.isResult;
	const headerStyle = useStatementColor({ deliberativeElement, isResult });
	const menuIconStyle = {
		color: headerStyle.backgroundColor,
		width: '24px',
	};

	const statementSubscription = useSelector(
		statementSubscriptionSelector(statement?.statementId)
	);

	const enableNavigationalElements =
		statement?.statementSettings?.enableNavigationalElements !== undefined
			? statement?.statementSettings?.enableNavigationalElements
			: true;
	const isAdmin = statementSubscription?.role === Role.admin;
	const allowNavigation = enableNavigationalElements || isAdmin;

	function handleGoToSettings() {
		setIsHeaderMenuOpen(false);
		if (statement && statement.statementId)
			navigate(`/statement/${statement?.statementId}/settings`);
	}

	function handleGotToChat() {
		if (statement && statement.statementId)
			navigate(`/statement/${statement?.statementId}/chat`);
	}
	function handleGoToMain() {
		if (statement && statement.statementId)
			navigate(`/statement/${statement?.statementId}`);
	}

	return (
		<nav
			className={styles.nav}
			data-cy="statement-nav"
			style={{ backgroundColor: headerStyle.backgroundColor }}
		>
			<div className={styles.wrapper}>
				{allowNavigation && (
					<div className={styles.button}>
						<Menu
							setIsOpen={setIsHeaderMenuOpen}
							isMenuOpen={isHeaderMenuOpen}
							iconColor={headerStyle.color}
							isHamburger={true}
						>
							<MenuOption
								label={t('Share')}
								icon={<ShareIcon style={menuIconStyle} />}
								onOptionClick={handleShare}
							/>
							<MenuOption
								label={t('Disconnect')}
								icon={<DisconnectIcon style={menuIconStyle} />}
								onOptionClick={handleLogout}
							/>
							{isAdmin && (
								<>
									<MenuOption
										label={t('Follow Me')}
										icon={<FollowMe style={menuIconStyle} />}
										onOptionClick={handleFollowMe}
									/>
									<MenuOption
										label={t('Invite with PIN number')}
										icon={<InvitationIcon style={menuIconStyle} />}
										onOptionClick={handleInvitePanel}
									/>
									<MenuOption
										label={t('Settings')}
										icon={<SettingsIcon style={menuIconStyle} />}
										onOptionClick={handleGoToSettings}
									/>
								</>
							)}
						</Menu>
					</div>
				)}
				{allowNavigation && (
					command !== 'chat' ?
						<button onClick={handleGotToChat}>
							<Chat color={headerStyle.color} />
						</button>
						:
						<button onClick={handleGoToMain}>
							<MainIcon color={headerStyle.color} />
						</button>
				)}
				<button onClick={handleToggleNotifications}>
					{permission ? (
						<BellIcon color={headerStyle.color} />
					) : (
						<BellSlashIcon color={headerStyle.color} />
					)}
				</button>
				<button>
					<View color={headerStyle.color} />
				</button>
				{allowNavigation && (
					<button className={styles.home}>
						<HomeButton headerColor={headerStyle} />
					</button>
				)}
				{allowNavigation && (
					<Back statement={statement} headerColor={headerStyle} />
				)}
			</div>
		</nav>
	);
};

export default StatementTopNav;