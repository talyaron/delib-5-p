import React, { createContext, useContext, useState, FC } from "react";
import { Position } from "reactflow";

// Define the context
interface MapProps {
    mapContext: MapProviderState;
    setMapContext: React.Dispatch<React.SetStateAction<MapProviderState>>;
}

const MapModelContext = createContext<MapProps | undefined>(undefined);

// Define a hook to use the context
export const useMapContext = (): MapProps => {
    const context = useContext(MapModelContext);
    if (!context) {
        throw new Error(
            "useMapContext must be used within a MyContextProvider"
        );
    }
    return context;
};

// Create a provider component
interface MapProviderProps {
    children: React.ReactNode;
}

interface MapProviderState {
    showModal: boolean;
    parentId: string;
    isOption: boolean;
    isQuestion: boolean;
    targetPosition: Position;
    sourcePosition: Position;
    nodeWidth: number;
    nodeHeight: number;
}

export const MapProvider: FC<MapProviderProps> = ({ children }) => {
    const [mapContext, setMapContext] = useState<MapProviderState>({
        showModal: false,
        parentId: "",
        isOption: false,
        isQuestion: false,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        nodeWidth: 80,
        nodeHeight: 80,
    });

    const contextValue: MapProps = {
        mapContext,
        setMapContext,
    };

    return (
        <MapModelContext.Provider value={contextValue}>
            {children}
        </MapModelContext.Provider>
    );
};
