import React, { createContext, useState, ReactNode } from "react";
import { Statement } from "delib-npm";

interface SubStatementsContextType {
  sortedSubStatements: Statement[];
  setSortedSubStatements: React.Dispatch<React.SetStateAction<Statement[]>>;
}

export const SubStatementsContext = createContext<SubStatementsContextType>({
  sortedSubStatements: [],
  setSortedSubStatements: () => {},
});

interface SubStatementsProviderProps {
  children: ReactNode;
}

export const SubStatementsProvider: React.FC<SubStatementsProviderProps> = ({ children }): ReactNode => {
  const [sortedSubStatements, setSortedSubStatements] = useState<Statement[]>([]);

  return (
    <SubStatementsContext.Provider value={{ sortedSubStatements, setSortedSubStatements }}>
      {children}
    </SubStatementsContext.Provider>
  );
};