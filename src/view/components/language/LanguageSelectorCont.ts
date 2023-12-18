import { setUserDefaultLanguageDB } from "../../../functions/db/users/setUsersDB";
import i18n from "../../../i18n";
import { store } from "../../../model/store";

export async function handleSetLanguage(e: any): Promise<void> {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    if (lang === "he" || lang === "ar") {
        document.body.style.direction = "rtl";
    } else {
        document.body.style.direction = "ltr";
    }
    localStorage.setItem("lang", lang);
    
    const user = store.getState().user.user;
    if (!user) return;
    await setUserDefaultLanguageDB(lang);
}
