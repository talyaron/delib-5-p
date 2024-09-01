import { Statement } from "delib-npm";
import { FC, useState, useRef } from "react";
import styles from "./Dot.module.scss";
import { useLanguage } from "@/controllers/hooks/useLanguages";


interface Props {
  subStatement: Statement;
  maxEvaluators: number;
}

const Dot: FC<Props> = ({ subStatement, maxEvaluators }) => {
	const {t} = useLanguage();
	const randomX = useRef<number>((Math.random() - 0.5) * 0.07);
	const randomY = useRef<number>((Math.random() - 0.5) * 0.07);
	const [show, setShow] = useState(false);
	const { sumCon, sumPro, numberOfEvaluators } = subStatement.evaluation!;
	if (sumCon === undefined || sumPro === undefined) return null;

	const agreement = (sumPro - sumCon) / numberOfEvaluators;
	const bottom = sumCon / maxEvaluators + randomX.current;
	const left = sumPro / maxEvaluators + randomY.current;

	function handleShowTooltip(isShow: boolean) {
		setShow(isShow);
	}

	return (
		<div
			key={subStatement.statementId}
			className={styles.dot}
			style={{
				bottom: `${bottom * 90}%`,
				left: `${left * 90}%`,
				backgroundColor: `var(${fromAgreementToColor(agreement, agreementColors)})`,
			}}
			onMouseEnter={() => handleShowTooltip(true)}
			onMouseLeave={() => handleShowTooltip(false)}
		>
			{show && (
				<div className={styles.tooltip}>
					<div className={styles["tooltip__title"]}>
						{subStatement.statement}
					</div>
					<div>{t("Support")}: {sumPro}</div>
					<div>{t("Against")}: {sumCon}</div>
					<div>{t("Voters")}: {numberOfEvaluators}</div>
				</div>
			)}
		</div>
	);
};

export default Dot;

const agreementColors = [
	"--range-tabu-100",
	"--range-tabu-60",
	"--range-tabu-30",
	"--range-conflict-100",
	"--range-conflict-60",
	"--range-conflict-30",
	"--range-positive-30",
	"--range-positive-60",
	"--range-positive-100",
];

function fromAgreementToColor(
	agreement: number,
	agreementColors: string[]
): string | undefined {
	try {
		if (agreement < -1 || agreement > 1) {
			throw new Error("Agreement must be between -1 and 1");
		}

		const adjustAgreement = (agreement + 1) / 2;

		const index = Math.floor(adjustAgreement * agreementColors.length * 0.99);
    
		return agreementColors[index];
	} catch (error) {
		console.error(error);

		return undefined;
	}
}
