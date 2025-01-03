import { SimpleStatement, Statement } from 'delib-npm'
import { FC } from 'react'
import styles from './StageCard.module.scss';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { convertToStageTitle } from '@/model/stages/stagesModel';


interface Props {
	statement: Statement
}

const StageCard: FC<Props> = ({ statement }) => {

	const { t } = useLanguage()
	const navigate = useNavigate();

	const chosen = statement.results || []


	function suggestNewSuggestion(ev: any) {
		ev.stopPropagation()
		navigate(`/statement/${statement.statementId}/main`)
	}

	return (
		<div className={styles.card}>
			<h3>{t(statement.statement ? statement.statement : convertToStageTitle(statement.stageType))}</h3>

			{chosen.length === 0 ? (<p>{t("No suggestion so far")}</p>) :
				<>
					<h4>{t("Selected Options")}</h4>
					<ul>
						{chosen.map((opt: SimpleStatement) => (
							<NavLink key={opt.statementId} to={`/statement/${opt.statementId}`}><li >{opt.statement}{opt.description ? ":" : ""} {opt.description}</li></NavLink>
						))}
					</ul>
				</>
			}
			<NavLink to={`/statement/${statement.statementId}/main`} ><p className={styles.seeMore}>See more...</p></NavLink>
			<div className="btns">
				<Button text="Add Suggestion" buttonType={ButtonType.SECONDARY} onClick={suggestNewSuggestion} />
			</div>
		</div>
	)
}

export default StageCard


