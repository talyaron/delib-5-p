import { install } from "../../../main";



export function prompStore(setDeferredPrompt: React.Dispatch<any>) {
    const deferredPrompt = install.deferredPrompt

    if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === "accepted") {
                console.info("User accepted the A2HS prompt")
            }
            setDeferredPrompt(null)
        })
    }
}



