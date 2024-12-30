import { ChoseBy, ChoseByEvaluationType, ResultsBy } from "delib-npm";
import { FC } from "react";

// Custom components

// Third party imports
import { useLanguage } from "@/controllers/hooks/useLanguages";
import RadioButtonWithLabel from "@/view/components/radioButtonWithLabel/RadioButtonWithLabel";
import styles from './ChoseBySettings.module.scss';
import { StatementSettingsProps } from "../../settingsTypeHelpers";

import { useSelector } from "react-redux";
import { choseBySelector } from "@/model/choseBy/choseBySlice";

const ChoseBySettings: FC<StatementSettingsProps> = ({
	statement
}) => {
	const { t } = useLanguage();
	const choseBy: ChoseBy | undefined = useSelector(choseBySelector(statement.statementId));




	return (
		<section className={styles.choseBy}>
			<h3 className="title">{t("By Which evaluation method to choose the top options")}</h3>
			<RadioButtonWithLabel
				id={t("By Consensus")}
				labelText={t("By Consensus")}
				checked={choseBy?.choseByEvaluationType === ChoseByEvaluationType.consensus}
				onChange={() => { }}
			/>
			<RadioButtonWithLabel
				id={t("By most liked")}
				labelText={t("By most liked")}
				checked={choseBy?.choseByEvaluationType === ChoseByEvaluationType.likes}
				onChange={() => { }}
			/>
		</section>
	);
};

export default ChoseBySettings;
