import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export enum LanguagesEnum {
	en = "en",
	ar = "ar",
	he = "he",
	de = "de",
	es = "es",
	nl = "nl",
}


import ar from "../../assets/Languages/ar.json";
import de from "../../assets/Languages/de.json";
import en from "../../assets/Languages/en.json";
import es from "../../assets/Languages/es.json";
import he from "../../assets/Languages/he.json";
import nl from "../../assets/Languages/nl.json";

const languages: Record<string, string>[] = [en, ar, he, de, es, nl];

// LanguageProvider component to wrap your application and provide the language context


type LanguageContextType = {
	currentLanguage: string;
	changeLanguage: (newLanguage: LanguagesEnum) => void;
	t: (text: string) => string;
	dir: "ltr" | "rtl";
};

type LanguageProviderProps = {
	defaultLanguage: LanguagesEnum;
	children: ReactNode;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Memoize the context value creation
const createContextValue = (
	currentLanguage: string,
	changeLanguage: (newLanguage: LanguagesEnum) => void,
	t: (text: string) => string
): LanguageContextType => ({
	currentLanguage,
	changeLanguage,
	t,
	dir: currentLanguage === "ar" || currentLanguage === "he" ? "rtl" : "ltr",
});

export function useLanguage() {
	const context = useContext(LanguageContext);

	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}

	return context;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	defaultLanguage,
	children,
}) => {
	const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
	const [languageData, setLanguageData] = useState<Record<string, string>>({});

	const changeLanguage = useCallback((newLanguage: LanguagesEnum) => {
		setCurrentLanguage(newLanguage);
	}, []);

	const t = useCallback((text: string) => {
		return languageData[text] || text;
	}, [languageData]);

	useEffect(() => {
		const languageIndex = Object.values(LanguagesEnum).indexOf(currentLanguage);

		if (languageIndex !== -1) {
			setLanguageData(languages[languageIndex]);
		} else {
			console.error(`Language data not found for ${currentLanguage}`);
		}
	}, [currentLanguage]);

	// Memoize the context value
	const contextValue = React.useMemo(
		() => createContextValue(currentLanguage, changeLanguage, t),
		[currentLanguage, changeLanguage, t]
	);

	return (
		<LanguageContext.Provider value={contextValue}>
			{children}
		</LanguageContext.Provider>
	);
};