import { ChoseBy, ChoseByEvaluationType, CutoffType } from "delib-npm";
import { FC, useEffect, useState } from "react";

// Custom components

// Third party imports
import { useLanguage } from "@/controllers/hooks/useLanguages";
import RadioButtonWithLabel from "@/view/components/radioButtonWithLabel/RadioButtonWithLabel";
import styles from './ChoseBySettings.module.scss';
import { StatementSettingsProps } from "../../settingsTypeHelpers";

import { useDispatch, useSelector } from "react-redux";
import { choseBySelector, setChoseBy } from "@/model/choseBy/choseBySlice";
import { setChoseByToDB } from "@/controllers/db/choseBy/setChoseBy";

interface RangeProps {
	maxValue: number;
	minValue: number;
	step: number;
	value: number;
}

const ChoseBySettings: FC<StatementSettingsProps> = ({
	statement
}) => {
	const { t } = useLanguage();
	const dispatch = useDispatch();
	const choseBy: ChoseBy | undefined = useSelector(choseBySelector(statement.statementId));

	const [rangeProps, setRangeProps] = useState<RangeProps>({
		maxValue: 20,
		minValue: 1,
		step: 1,
		value: choseBy?.number ?? 0,
	});

	useEffect(() => {

		if (choseBy?.CutoffType === CutoffType.topOptions) {


			setRangeProps({
				maxValue: 20,
				minValue: 1,
				step: 1,
				value: choseBy?.number ?? 0,
			});
			dispatch(setChoseBy({ ...choseBy, number: Math.ceil(choseBy.number) }));
		}
		else if (choseBy?.CutoffType === CutoffType.cutoffValue) {

			setRangeProps({
				maxValue: 10,
				minValue: -10,
				step: 0.1,
				value: choseBy?.number ?? 0,
			});
		}
	}, [choseBy?.CutoffType]);


	function handleEvaluationChange(e: any) {

		if (!e.target.id) return;
		if (!choseBy) return;
		const newChoseBy = {
			...choseBy,
			choseByEvaluationType: e.target.id,
		};
		dispatch(setChoseBy(newChoseBy));
		setChoseByToDB(newChoseBy);

	}


	function handleCutoffChange(e: any) {
		if (!e.target.id) return;
		if (!choseBy) return;
		const newChoseBy = {
			...choseBy,
			CutoffType: e.target.id,
		};
		dispatch(setChoseBy(newChoseBy));
		setChoseByToDB(newChoseBy);
	}

	function handleRangeChange(e: any) {

		if (!choseBy) return;

		setRangeProps({
			...rangeProps,
			value: getValue(e.target.value),
		});

		const newChoseBy = {
			...choseBy,
			number: getValue(e.target.value),
		};

		if (e.type === "mouseup" || e.type === "touchend") {
			setChoseByToDB(newChoseBy);
			dispatch(setChoseBy(newChoseBy));
		}

	}

	function getValue(value: number) {
		return choseBy?.CutoffType === CutoffType.cutoffValue ? value ?? 0 : Math.ceil(value ?? 0);
	}




	return (
		<div className={styles.choseBy}>
			<h2>{t("Options Selection Criteria")}</h2>
			<section >
				<h3 className="title">{t("How to evaluate and select top options")}</h3>
				<RadioButtonWithLabel
					id={ChoseByEvaluationType.consensus}
					labelText={t("By Consensus")}
					checked={choseBy?.choseByEvaluationType === ChoseByEvaluationType.consensus}
					onChange={handleEvaluationChange}
				/>
				<RadioButtonWithLabel
					id={ChoseByEvaluationType.likes}
					labelText={t("By most liked")}
					checked={choseBy?.choseByEvaluationType === ChoseByEvaluationType.likes}
					onChange={handleEvaluationChange}
				/>
				<RadioButtonWithLabel
					id={ChoseByEvaluationType.likesDislikes}
					labelText={t("By sum liked - disliked")}
					checked={choseBy?.choseByEvaluationType === ChoseByEvaluationType.likesDislikes}
					onChange={handleEvaluationChange}
				/>
			</section>
			<section>
				<h3 className="title">{t("Method of selecting leading options")}</h3>
				<RadioButtonWithLabel
					id={CutoffType.topOptions}
					labelText={`${t("Top results")}: ${choseBy?.CutoffType === CutoffType.topOptions ? rangeProps.value : ""}`}
					checked={choseBy?.CutoffType === CutoffType.topOptions}
					onChange={handleCutoffChange}
				/>
				<RadioButtonWithLabel
					id={CutoffType.cutoffValue}
					labelText={`${t("Above specific value")}: ${choseBy?.CutoffType === CutoffType.cutoffValue ? rangeProps.value : ""}`}
					checked={choseBy?.CutoffType === CutoffType.cutoffValue}
					onChange={handleCutoffChange}
				/>
			</section>
			<section>
				<div className="title">{t("Value")}</div>
				<div className={styles.range}>
					<span>{rangeProps.minValue}</span>
					<input
						className="range"
						type="range"
						aria-label="Number Of Results"
						name="numberOfResults"
						value={rangeProps?.value}
						min={rangeProps.minValue}
						max={rangeProps.maxValue}
						step={rangeProps.step}
						onChange={handleRangeChange}
						onMouseUp={handleRangeChange}
						onTouchEnd={handleRangeChange}

					/>
					<span>{rangeProps.maxValue}</span>

				</div>
				<div className={styles.cutoffValue}>
					{rangeProps.value}
				</div>
			</section>
		</div>
	);
};

export default ChoseBySettings;
