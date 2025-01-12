import React, { createContext, useContext } from 'react';

interface NewStatementContextProps {

	title?: string;
	description?: string;
	setTitle: (statement: string) => void;
	setDescription: (description: string) => void;
	setCurrentStep: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3 | 4>>;
}

export const NewStatementContext = createContext<NewStatementContextProps>({
	title: '',
	description: '',
	setTitle: () => { return; },
	setDescription: () => { return; },
	setCurrentStep: () => { return; },
});

// export const NewStatementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
// 	const [statement, setStatement] = useState<string>('');

// 	return (
// 		<NewStatementContext.Provider value={{ statement, setStatement }}>
// 			{children}
// 		</NewStatementContext.Provider>
// 	);
// };

export const useNewStatement = (): NewStatementContextProps => {
	const context = useContext(NewStatementContext);
	if (!context) {
		throw new Error('useNewStatement must be used within a NewStatementProvider');
	}

	return context;
};