import { Statement } from 'delib-npm';

export interface OptionsBarsProps {
	setStatementInfo: React.Dispatch<React.SetStateAction<Statement | null>>;
	statement: Statement;
	setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
	totalVotes: number;
	options: Statement[];
	optionsCount: number;
}

export interface OptionBarProps {
	option: Statement;
	totalVotes: number;
	statement: Statement;
	order: number;
	setStatementInfo: React.Dispatch<React.SetStateAction<Statement | null>>;
	setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
	optionsCount: number;
}
