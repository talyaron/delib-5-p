// Helpers
import { useEffect, useState } from "react";

// icons
import InstallIcon from "@/assets/icons/installIcon.svg?react";
import InvitationIcon from "@/assets/icons/invitation.svg?react";

// Components
import DisconnectIcon from "@/assets/icons/disconnectIcon.svg?react";
import { handleLogout } from "@/controllers/general/helpers";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import IconButton from "../../components/iconButton/IconButton";
import Menu from "../../components/menu/Menu";
import MenuOption from "../../components/menu/MenuOption";
import InvitationModal from "./main/invitationModal/InvitationModal";

export default function HomeHeader() {

	const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
	const [showInvitationModal, setShowInvitationModal] = useState(false);

	const [isInstallable, setIsInstallable] = useState(false);
	interface BeforeInstallPromptEvent extends Event {
		prompt: () => void;
		userChoice: Promise<{ outcome: string }>;
	}

	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent|null>(null);

	const { t, dir } = useLanguage();


	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (e: Event) => {
			const beforeInstallPromptEvent = e as BeforeInstallPromptEvent;
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			beforeInstallPromptEvent.preventDefault();

			// Stash the event so it can be triggered later
			setDeferredPrompt(beforeInstallPromptEvent);
			setIsInstallable(true);
		});
	}, []);
	function handleInstallApp() {
		try {
 
			if (deferredPrompt) {
			
				deferredPrompt.prompt();
				deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
		  if (choiceResult.outcome === 'accepted') {
						console.info('User accepted the install prompt');
		  } else {
						console.info('User dismissed the install prompt');
		  }
		  setDeferredPrompt(null);
		  setIsInstallable(false);
				});
	  }
		} catch (error) {
			console.error(error);
		}
	}
	function handleInvitationPanel() {
		try {
			setShowInvitationModal(true);
			setIsHomeMenuOpen(false);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className={`homePage__header ${dir}`}>
			<div className="homePage__header__wrapper">
				<h1 className="homePage__header__wrapper__title">FreeDi</h1>
				<div className="homePage__header__wrapper__icons">
					{isInstallable && (
						<IconButton onClick={handleInstallApp}>
							<InstallIcon />
						</IconButton>
					)}
					<Menu
						isMenuOpen={isHomeMenuOpen}
						setIsOpen={setIsHomeMenuOpen}
						iconColor="white"
					>
						<MenuOption
							icon={<DisconnectIcon style={{ color: "#4E88C7" }} />}
							label={t("Disconnect")}
							onOptionClick={() => handleLogout(dispatch)}
						/>
						<MenuOption
							icon={<InvitationIcon style={{ color: "#4E88C7" }} />}
							label={t("Join with PIN number")}
							onOptionClick={handleInvitationPanel}
						/>
					</Menu>
				</div>
			</div>
			{showInvitationModal && (
				<InvitationModal setShowModal={setShowInvitationModal} />
			)}
		</div>
	);
}
