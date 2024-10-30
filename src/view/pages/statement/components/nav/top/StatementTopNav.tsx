import { FC } from 'react';
import styles from './StatementTopNav.module.scss';
// Third party imports
import { Statement } from 'delib-npm';

// Helpers
import useStatementColor from '@/controllers/hooks/useStatementColor.ts';

//icons
import Chat from '@/assets/icons/chatTop.svg?react';
import Bell from '@/assets/icons/bellIcon.svg?react';
import View from '@/assets/icons/view.svg?react';
import Burger from '@/assets/icons/burgerIcon.svg?react';
import Home from '@/assets/icons/homeIcon.svg?react';

//components
import Back from '../../header/Back';

interface Props {
	statement?: Statement;
}

const StatementTopNav: FC<Props> = ({ statement }) => {
	const deliberativeElement = statement?.deliberativeElement;
	const isResult = statement?.isResult;
	const headerStyle = useStatementColor({ deliberativeElement, isResult });

	return (
		<nav
			className={styles.nav}
			data-cy='statement-nav'
			style={{ backgroundColor: headerStyle.backgroundColor }}
		>
			<div className={styles.wrapper}>
				<button>
					<Burger color={headerStyle.color} />
				</button>
				<button>
					<Chat color={headerStyle.color} />
				</button>
				<button>
					<Bell color={headerStyle.color} />
				</button>
				<button>
					<View color={headerStyle.color} />
				</button>
				<button className={styles.home}>
					<Home color={headerStyle.color} />
				</button>
				<button className={styles.back}>
					<Back statement={statement} headerColor={headerStyle}/>
				</button>
			</div>
		</nav>
	);
};

export default StatementTopNav;
