import { FC } from "react";

// Third party imports
import { Link } from "react-router-dom";
import { NavObject, Statement, Screen, StatementSubscription } from "delib-npm";

// Helpers
import { showNavElements } from "./statementTopNavCont";
import { allScreens } from "./StatementTopNavModel.tsx";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import useStatementColor from "@/controllers/hooks/useStatementColor.ts";

interface Props {
	statement: Statement;
	statementSubscription: StatementSubscription | undefined;
	screen: Screen;
}

const StatementTopNav: FC<Props> = ({ statement, statementSubscription, screen }) => {
	const { t } = useLanguage();
	const headerStyle = useStatementColor(statement.statementType);
	
	const _navArray = showNavElements({ statement, statementSubscription, navArray: allScreens });

	return (
		<nav className="page__header__nav" data-cy="statement-nav">
			{_navArray.map((screenInfo: NavObject) => (
				<Link
					key={screenInfo.id}
					aria-label={screenInfo.name}
					to={`/statement/${statement.statementId}/${screenInfo.link}${screenInfo.link === Screen.VOTE ? "/votes-voted" : ""}`}
					className={`page__header__nav__button ${screen === screenInfo.link
						? "page__header__nav__button--selected"
						: ""
					}`}
					style={{ "maxWidth":_navArray.length === 1 ? '90%':"none"}}
				>
					<p className="page__header__nav__button__tabTxt" style={{color: headerStyle.backgroundColor}}>
						{t(screenInfo.name)}
					</p>					
					<screenInfo.icon fill={screen === screenInfo.link ? headerStyle.backgroundColor : 'none'} />
				</Link>
			))}
			
		</nav>
	);
};

export default StatementTopNav;
