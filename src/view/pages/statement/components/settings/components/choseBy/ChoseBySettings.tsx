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
	});

	useEffect(() => {
		console.log(choseBy?.CutoffType)
		if (choseBy?.CutoffType === CutoffType.topOptions) {


			setRangeProps({
				maxValue: 20,
				minValue: 1,
				step: 1,
			});
			console.log(Math.ceil(choseBy.number))
			dispatch(setChoseBy({ ...choseBy, number: Math.ceil(choseBy.number) }));
		}
		else if (choseBy?.CutoffType === CutoffType.cutoffValue) {

			setRangeProps({
				maxValue: 10,
				minValue: -10,
				step: 0.1,
			});
		}
	}, [choseBy?.CutoffType]);


	function handleChange(e: any) {

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
		console.log("handleRangeChange")
		if (!choseBy) return;
		const value = choseBy.CutoffType === CutoffType.topOptions ? parseInt(e.target.value) : parseFloat(e.target.value);
		const newChoseBy = {
			...choseBy,
			number: getValue(value),
		};
		dispatch(setChoseBy(newChoseBy));
		setChoseByToDB(newChoseBy);
	}

	function getValue(value: number) {
		return choseBy?.CutoffType === CutoffType.cutoffValue ? value ?? 0 : Math.ceil(value ?? 0);
	}

	const value = getValue(choseBy?.number ?? 0);


	return (
		<>
			<section className={styles.choseBy}>
				<h3 className="title">{t("How to evaluate and select top options")}</h3>
				<RadioButtonWithLabel
					id={ChoseByEvaluationType.consensus}
					labelText={t("By Consensus")}
					checked={choseBy?.choseByEvaluationType === ChoseByEvaluationType.consensus}
					onChange={handleChange}
				/>
				<RadioButtonWithLabel
					id={ChoseByEvaluationType.likes}
					labelText={t("By most liked")}
					checked={choseBy?.choseByEvaluationType === ChoseByEvaluationType.likes}
					onChange={handleChange}
				/>
				<RadioButtonWithLabel
					id={ChoseByEvaluationType.likesDislikes}
					labelText={t("By sum liked - disliked")}
					checked={choseBy?.choseByEvaluationType === ChoseByEvaluationType.likesDislikes}
					onChange={handleChange}
				/>
			</section>
			<section className={styles.choseBy}>
				<h3 className="title">{t("Method of selecting leading options")}</h3>
				<RadioButtonWithLabel
					id={CutoffType.topOptions}
					labelText={t("Top X results")}
					checked={choseBy?.CutoffType === CutoffType.topOptions}
					onChange={handleCutoffChange}
				/>
				<RadioButtonWithLabel
					id={CutoffType.cutoffValue}
					labelText={t("Above specific value")}
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
						value={value}
						min={rangeProps.minValue}
						max={rangeProps.maxValue}
						step={rangeProps.step}
						onChange={handleRangeChange}

					/>
					<span>{rangeProps.maxValue}</span>

				</div>
				<div className={styles.cutoffValue}>
					{value}
				</div>
			</section>
		</>
	);
};

export default ChoseBySettings;
