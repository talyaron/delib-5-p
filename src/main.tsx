import React from "react";
import ReactDOM from "react-dom/client";
import "./view/style/style.scss";

import { RouterProvider } from "react-router-dom";

import { store } from "./model/store";
import { Provider } from "react-redux";
import { setIntialLocationSessionStorage } from "./functions/general/helpers";

import { router } from "./router";
import { LanguageProvider, LanguagesEnum } from "./functions/hooks/useLanguages";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <LanguageProvider defaultLanguage={LanguagesEnum.he}>
                <RouterProvider router={router} />
            </LanguageProvider>
        </Provider>
    </React.StrictMode>,
);

setIntialLocationSessionStorage(window.location.pathname);

export const install: { deferredPrompt: any } = {
    deferredPrompt: null,
};

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    install.deferredPrompt = e;
});
