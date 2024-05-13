import { install } from "../../../App";

export function prompStore(
	setDeferredPrompt: React.Dispatch<React.SetStateAction<Event | null>>,
) {
	const deferredPrompt = install.deferredPrompt;

	if (deferredPrompt) {
		deferredPrompt.prompt();
		deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
			if (choiceResult.outcome === "accepted") {
				console.info("User accepted the A2HS prompt");
			}
			setDeferredPrompt(null);
		});
	}
}
