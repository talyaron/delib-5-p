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
    changeLanguage: (newLanguage: string) => void;
    languageData: Record<string, string>;
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
    defaultLanguage: string;
    children: React.ReactNode;
}

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
    const changeLanguage = useCallback((newLanguage: string) => {
        setCurrentLanguage(newLanguage);
    }, []);

    // Fetch language data when the language changes or on component mount
    useEffect(() => {
        async function fetchLanguageData() {
            try {
                const response = await import(
                    `../../assets/Languages/${currentLanguage}.json`
                );

                setLanguageData(response);
            } catch (error: any) {
                console.error(`Error fetching language data: ${error.message}`);
            }
        }

        fetchLanguageData();
    }, [currentLanguage]);

    // Value passed to the context provider
    const contextValue: LanguageContextType = {
        currentLanguage,
        changeLanguage,
        languageData,
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};
