import { useEffect, useState } from "react";

// Third party libraries
import { useNavigate } from "react-router-dom";
import { StatementSubscription } from "delib-npm";

// Redux store
import { useAppSelector } from "../../../../controllers/hooks/reduxHooks";
import { statementsSubscriptionsSelector } from "../../../../model/statements/statementsSlice";

// Custom components
import Footer from "../../../components/footer/Footer";
import ScreenSlide from "../../../components/animation/ScreenSlide";
import PeopleLoader from "../../../components/loaders/PeopleLoader";
import MainCard from "./mainCard/MainCard";

const HomeMain = () => {
	// Hooks
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const statements: StatementSubscription[] = useAppSelector(
		statementsSubscriptionsSelector,
	)
		.filter((s) => s.statement.parentId === "top")
		.sort((a, b) => b.lastUpdate - a.lastUpdate);

	function handleAddStatement() {
		navigate("/home/addStatement", {
			state: { from: window.location.pathname },
		});
	}

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 3000);

		if (statements.length > 0) {
			setLoading(false);
		}
	}, [statements]);

	return (
		<ScreenSlide className="page__main slide-in">
			<div
				className="wrapper"
				style={{
					justifyContent: statements.length > 0 ? "start" : "center",
				}}
			>
				{!loading ? (
					statements.map((statement) => (
						<MainCard
							key={statement.statement.statementId}
							statement={statement.statement}
						/>
					))
				) : (
					<PeopleLoader />
				)}
			</div>
			<Footer onclick={handleAddStatement} />
		</ScreenSlide>
	);
};

export default HomeMain;
