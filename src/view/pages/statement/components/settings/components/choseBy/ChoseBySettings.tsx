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

const ChoseBySettings: FC<StatementSettingsProps> = ({
	statement
}) => {
	const { t } = useLanguage();
	const dispatch = useDispatch();
	const choseBy: ChoseBy | undefined = useSelector(choseBySelector(statement.statementId));

	const [numberTitle, setNumberTitle] = useState<string>(t("Number of Results to Display"));

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

	useEffect(() => {
		if (choseBy?.CutoffType === CutoffType.topOptions) setNumberTitle(t("Top Options"))
		else if (choseBy?.CutoffType === CutoffType.cutoffValue) setNumberTitle(t("Options with Value above Cutoff"));
	}, [choseBy?.CutoffType]);

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
				<h3 className="title">{t("Cutoff method")}</h3>
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
				<div className="title">{numberTitle}</div>
				<div className="range-box">
					<input
						className="range"
						type="range"
						aria-label="Number Of Results"
						name="numberOfResults"
						value={choseBy?.number}
						min="1"
						max="20"
						onChange={() => { }}

					/>
					<span className="number-of-results">
						{choseBy?.number}
					</span>
				</div>
			</section>
		</>
	);
};

export default ChoseBySettings;
