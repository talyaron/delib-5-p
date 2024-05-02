import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";

// Define types
type LanguageContextType = {
    currentLanguage: string;
    changeLanguage: (newLanguage: LanguagesEnum) => void;
    t: (text: string) => string;
    dir:"ltr"|"rtl"
};

// Create a context to hold the current language and the language change function
const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined,
);

// Custom hook to provide access to the language context
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }

    return context;
}

interface LanguageProviderProps {
    defaultLanguage: LanguagesEnum;
    children: React.ReactNode;
}

export enum LanguagesEnum {
    en = "en",
    ar = "ar",
    de = "de",
    es = "es",
    he = "he",
    nl = "nl",
}

import en from "../../assets/Languages/en.json";
import ar from "../../assets/Languages/ar.json";
import de from "../../assets/Languages/de.json";
import es from "../../assets/Languages/es.json";
import he from "../../assets/Languages/he.json";
import nl from "../../assets/Languages/nl.json";

const languages: Record<string, string>[] = [en, ar, de, es, he, nl];

// LanguageProvider component to wrap your application and provide the language context
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
    defaultLanguage,
    children,
}) => {
    const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

    const [languageData, setLanguageData] = useState<Record<string, string>>(
        {},
    );

    // Function to change the language
    const changeLanguage = useCallback((newLanguage: LanguagesEnum) => {
        setCurrentLanguage(newLanguage);
    }, []);

    // Fetch language data when the language changes or on component mount
    useEffect(() => {
        async function fetchLanguageData() {
            try {
                const languageIndex =
                    Object.values(LanguagesEnum).indexOf(currentLanguage);
                if (languageIndex !== -1) {
                    setLanguageData(languages[languageIndex]);
                } else {
                    console.error(
                        `Language data not found for ${currentLanguage}`,
                    );
                }
            } catch (error: any) {
                console.error(`Error fetching language data: ${error.message}`);
            }
        }

        fetchLanguageData();
    }, [currentLanguage]);

    const t = (text: string) => {
        return languageData[text] || text;
    };

    // Value passed to the context provider
    const contextValue: LanguageContextType = {
        currentLanguage,
        changeLanguage,
        t,
        dir: currentLanguage === "ar" || currentLanguage === "he" ? "rtl" : "ltr",
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};
