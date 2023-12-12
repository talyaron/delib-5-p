import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    FC,
} from "react";

// Define the context
interface MyContextProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    parentId: string;
    setParentId: React.Dispatch<React.SetStateAction<string>>;
    isOption: boolean;
    setIsOption: React.Dispatch<React.SetStateAction<boolean>>;
    isQuestion: boolean;
    setIsQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapModelContext = createContext<MyContextProps | undefined>(undefined);

// Define a hook to use the context
export const useMyContext = (): MyContextProps => {
    const context = useContext(MapModelContext);
    if (!context) {
        throw new Error("useMyContext must be used within a MyContextProvider");
    }
    return context;
};

// Create a provider component
interface MyContextProviderProps {
    children: React.ReactNode;
}

export const MapModelProvider: FC<MyContextProviderProps> = ({ children }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [parentId, setParentId] = useState("");
    const [isOption, setIsOption] = useState(false);
    const [isQuestion, setIsQuestion] = useState(false);

    // Example: Use useEffect to perform side effects when the value changes
    useEffect(() => {
        console.log("Value changed:", showModal);
        // You can perform any other side effects here
    }, [showModal]);

    const contextValue: MyContextProps = {
        showModal,
        setShowModal,
        parentId,
        setParentId,
        isOption,
        setIsOption,
        isQuestion,
        setIsQuestion,
    };

    return (
        <MapModelContext.Provider value={contextValue}>{children}</MapModelContext.Provider>
    );
};
