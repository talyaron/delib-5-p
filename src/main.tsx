import React from "react";
import ReactDOM from "react-dom/client";
import "./view/style/style.scss";

import { RouterProvider } from "react-router-dom";

import { store } from "./model/store";
import { Provider } from "react-redux";

import { router } from "./router";
import {
	LanguageProvider,
	LanguagesEnum,
} from "./controllers/hooks/useLanguages";
import { setInitLocation } from "./model/location/locationSlice";

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
