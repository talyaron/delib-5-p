import { FC } from "react";

// Third party imports
import { Link } from "react-router-dom";
import { NavObject, Statement, Screen, StatementSubscription } from "delib-npm";

// Helpers
import { showNavElements } from "./statementTopNavCont";
import { allScreens } from "./StatementTopNavModel";
import { useLanguage } from "../../../../../../controllers/hooks/useLanguages";

interface Props {
	statement: Statement;
	statementSubscription: StatementSubscription | undefined;
	screen: Screen;
}

const StatementTopNav: FC<Props> = ({ statement, statementSubscription, screen }) => {
	const { t } = useLanguage();

	const _navArray = showNavElements({ statement, statementSubscription, navArray: allScreens });

	return (
		<nav className="page__header__nav" data-cy="statement-nav">
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
					<img className='page__header__nav__button__navIcon' src={screenInfo.icon} />
				</Link>
			))}
		</nav>
	);
};

export default StatementTopNav;
