import { Screen, Statement } from "delib-npm";

export function allowedScreens(statement: Statement | undefined, screens: Screen[] |undefined): Screen[] {
	try {
    
		if (!statement) throw new Error("No statement");
		if (!screens) throw new Error("No screens");
		const _allowedScreens = new Set([... screens]);
		const allowedScreens = Array.from(_allowedScreens);
        
		return allowedScreens.length > 0 ? allowedScreens : [Screen.OPTIONS, Screen.VOTE, Screen.CHAT];
        
	} catch (error) {
		console.error(error);
		
		return [Screen.CHAT];
	}
}