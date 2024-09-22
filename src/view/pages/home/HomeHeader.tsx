// Helpers
import { useEffect, useState } from "react";
import { prompStore } from "./main/HomeMainCont";

// icons
import InstallIcon from "@/assets/icons/installIcon.svg?react";
import InvitationIcon from "@/assets/icons/invitation.svg?react";

// Components
import { install } from "@/App";
import DisconnectIcon from "@/assets/icons/disconnectIcon.svg?react";
import { handleLogout } from "@/controllers/general/helpers";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import IconButton from "../../components/iconButton/IconButton";
import Menu from "../../components/menu/Menu";
import MenuOption from "../../components/menu/MenuOption";
import InvitationModal from "./main/invitationModal/InvitationModal";


export default function HomeHeader() {
	// Use State
	const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
	const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
	const [showInvitationModal, setShowInvitationModal] = useState(false);
	
	const { t, dir } = useLanguage();
	useEffect(() => {
		// for deferred app install
		setDeferredPrompt(install.deferredPrompt);
	}, []);
	function handleInstallApp() {
		try {
			prompStore(setDeferredPrompt);
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
				<h1
					className="homePage__header__wrapper__title"
					children={t("Delib")}
				/>
				<div className="homePage__header__wrapper__icons">
					{deferredPrompt && (
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
							onOptionClick={() => handleLogout()}
						/>
						<MenuOption
							icon={<InvitationIcon style={{ color: "#4E88C7" }}/>}
							label={t("Join with PIN number")}
							onOptionClick={handleInvitationPanel}
						/>
					</Menu>
				</div>
			</div>
			{showInvitationModal && <InvitationModal setShowModal={setShowInvitationModal} />}
		</div>
	);
}












