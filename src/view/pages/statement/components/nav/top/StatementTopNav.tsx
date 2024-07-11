import { FC } from "react";

// Third party imports
import { Link } from "react-router-dom";
import { NavObject, Statement, Screen, StatementSubscription, StatementType } from "delib-npm";

// Helpers
import { showNavElements } from "./statementTopNavCont";
import { allScreens } from "./StatementTopNavModel.tsx";
import { useLanguage } from "../../../../../../controllers/hooks/useLanguages";
import useStatementColor from "../../../../../../controllers/hooks/useStatementColor.ts";

interface Props {
	statement: Statement;
	statementSubscription: StatementSubscription | undefined;
	screen: Screen;
}

const StatementTopNav: FC<Props> = ({ statement, statementSubscription, screen }) => {
	const { t } = useLanguage();
	const headerColor = useStatementColor(statement?.statementType || '');
	const _navArray = showNavElements({ statement, statementSubscription, navArray: allScreens });


	return (
		<nav className="page__header__nav" data-cy="statement-nav" style={{color:headerColor.color, backgroundColor:headerColor.backgroundColor}}>
			{_navArray.map((screenInfo: NavObject) => (
				<Link
					key={screenInfo.id}
					to={`/statement/${statement.statementId}/${screenInfo.link}${screenInfo.link === Screen.VOTE ? "/votes-voted" : ""
						}`}
					className={`page__header__nav__button ${screen === screenInfo.link
						? "page__header__nav__button--selected"
						: ""
						}`}
				>
					<p className="page__header__nav__button__tabTxt">
						{t(screenInfo.name)}
					</p>					
					<screenInfo.icon fill={screen === screenInfo.link ? `${headerColor.color}` : 'none'} />
				</Link>
			))}
			
		</nav>
	);
};

export default StatementTopNav;
