import React from "react"
import ReactDOM from "react-dom/client"
import "./view/style/style.scss"
import "./i18n"

import { BrowserRouter } from "react-router-dom"

import { store } from "./model/store"
import { Provider } from "react-redux"
import AppRouter from "./AppRouter"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                {/* <RouterProvider router={router} /> */}
                <AppRouter />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
)

export const install: { deferredPrompt: any } = {
    deferredPrompt: null,
}

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    install.deferredPrompt = e
})
