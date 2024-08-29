import { FC } from "react";

// Redux store
import {
	useAppDispatch,
	useAppSelector,
} from "@/controllers/hooks/reduxHooks";
import {
	parentVoteSelector,
	setVoteToStore,
} from "@/model/vote/votesSlice";

// Statements helpers
import { setVote } from "@/controllers/db/vote/setVote";
import { getSelections } from "../../statementVoteCont";
import { statementTitleToDisplay } from "@/controllers/general/helpers";
import InfoIcon from "@/assets/icons/infoCircleIcon.svg?react";
import HandIcon from "@/assets/icons/handIcon.svg?react";
import LikeIcon from "@/assets/icons/likeIcon.svg?react";
import { OptionBarProps } from "../../voteTypesHelper";
import "./OptionBar.scss";
import { getStatementFromDB } from "@/controllers/db/statements/getStatement";
import { getBarWidth } from "./OptionBarCont";



interface OptionBarExtendedProps extends OptionBarProps {
    isVertical: boolean;
    screenWidth: number;
}

export const OptionBar: FC<OptionBarExtendedProps> = ({
	option,
	totalVotes,
	statement,
	order,
	setStatementInfo,
	setShowInfo,
	isVertical,
	optionsCount,
	screenWidth,
}) => {
	// * Redux * //
	const dispatch = useAppDispatch();
	const vote = useAppSelector(parentVoteSelector(option.parentId));

	// * Variables * //
	const _optionOrder = option.order || 0;
	const selections: number = getSelections(statement, option);

	const barWidth = getBarWidth({
		isVertical,
		totalOptionsCount: optionsCount,
		screenWidth,
	});
	const padding = 40;

	const { shortVersion } = statementTitleToDisplay(option.statement, 30);
	const barHeight =
        selections > 0 && totalVotes > 0
        	? Math.round((selections / totalVotes) * 100)
        	: 0;

	// * Functions * //
	const handleVotePress = () => {
		dispatch(setVoteToStore(option));
		setVote(option);
		getStatementFromDB(option.statementId);
	};

	const isOptionSelected = vote?.statementId === option.statementId;

	const containerInset = `${(_optionOrder - order) * barWidth}px`;
	const containerStyle = {
		[isVertical ? "right" : "left"]: containerInset,
		width: `${barWidth}px`,
	};

	const voteButtonStyle = {
		width: `${barWidth - padding}px`,
		backgroundColor: isOptionSelected ? option.color : "White",
	};

	const barStyle = {
		height: `${barHeight}%`,
		width: `${barWidth - padding}px`,
		backgroundColor: option.color,
	};

	const shouldShowStat = barHeight > 0;

	return (
		<div
			className={`option-bar ${isVertical ? "vertical" : "horizontal"}`}
			style={containerStyle}
		>
			<div className="column" style={{ width: `${barWidth}px` }}>
				{shouldShowStat && (
					<div className="percentage-text">{barHeight}%</div>
				)}
				<div className="bar drop-shadow" style={barStyle}>
					<div className="number-of-selections">{selections}</div>
				</div>
			</div>
			<div className="vote-button-container drop-shadow">
				<button
					onClick={handleVotePress}
					aria-label="Vote button"
					style={voteButtonStyle}
					className={`vote-button ${
						isOptionSelected ? "selected" : ""
					}`}
				>
					{isOptionSelected ? (
						<LikeIcon />
					) : (
						<HandIcon style={{ color: option.color }} />
					)}
				</button>
			</div>
			<button
				className="info-icon"
				aria-label="Info button"
				onClick={() => {
					setStatementInfo(option);
					setShowInfo(true);
				}}
			>
				<InfoIcon
					style={{ color: barHeight > 10 ? "white" : "#6E8AA6" }}
				/>
			</button>
			<div className={`title ${barWidth < 90 ? "is-bar-small" : ""}`}>
				{shortVersion}
			</div>
		</div>
	);
};

export default OptionBar;

