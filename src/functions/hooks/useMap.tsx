import React, { createContext, useContext, useState, FC } from "react";
import { Position } from "reactflow";

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
    targetPosition: Position;
    setTargetPosition: React.Dispatch<React.SetStateAction<Position>>;
    sourcePosition: Position;
    setSourcePosition: React.Dispatch<React.SetStateAction<Position>>;
    nodeWidth: number;
    setNodeWidth: React.Dispatch<React.SetStateAction<number>>;
    nodeHeight: number;
    setNodeHeight: React.Dispatch<React.SetStateAction<number>>;
}

const MapModelContext = createContext<MyContextProps | undefined>(undefined);

// Define a hook to use the context
export const useMapContext = (): MyContextProps => {
    const context = useContext(MapModelContext);
    if (!context) {
        throw new Error(
            "useMapContext must be used within a MyContextProvider"
        );
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
    const [targetPosition, setTargetPosition] = useState(Position.Top);
    const [sourcePosition, setSourcePosition] = useState(Position.Bottom);
    const [nodeWidth, setNodeWidth] = useState(80);
    const [nodeHeight, setNodeHeight] = useState(80);

    const contextValue: MyContextProps = {
        showModal,
        setShowModal,
        parentId,
        setParentId,
        isOption,
        setIsOption,
        isQuestion,
        setIsQuestion,
        targetPosition,
        setTargetPosition,
        sourcePosition,
        setSourcePosition,
        nodeWidth,
        setNodeWidth,
        nodeHeight,
        setNodeHeight,
    };

    return (
        <MapModelContext.Provider value={contextValue}>
            {children}
        </MapModelContext.Provider>
    );
};
