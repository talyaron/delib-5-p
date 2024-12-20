import React from "react";
import ReactDOM from "react-dom/client";
import "./view/style/style.scss";

import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import {
	LanguageProvider,
	LanguagesEnum,
} from "./controllers/hooks/useLanguages";
import { setInitLocation } from "./model/location/locationSlice";
import { store } from "./model/store";

import { router } from "./router";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<LanguageProvider defaultLanguage={LanguagesEnum.he}>
				<RouterProvider future={{v7_startTransition: true}} router={router} />
			</LanguageProvider>
		</Provider>
	</React.StrictMode>,
);

store.dispatch(
	setInitLocation(
		window.location.pathname === "/" ? "/home" : window.location.pathname,
	),
);
