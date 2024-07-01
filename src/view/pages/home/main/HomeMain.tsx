import { useEffect, useState } from "react";
import "../../../style/homePage.scss"

// Third party libraries
import { useNavigate } from "react-router-dom";
import { Statement } from "delib-npm";

// Redux store
import { useAppSelector } from "../../../../controllers/hooks/reduxHooks";
import { statementsSelector } from "../../../../model/statements/statementsSlice";

// Custom components
import Footer from "../../../components/footer/Footer";
import ScreenSlide from "../../../components/animation/ScreenSlide";
import PeopleLoader from "../../../components/loaders/PeopleLoader";
import MainCard from "./mainCard/MainCard";

//images
import bike from "../../../../assets/images/bike.png";

const HomeMain = () => {
	// Hooks
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const statements: Statement[] = useAppSelector(statementsSelector)
		.filter((s) => s.parentId === "top")
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
		<ScreenSlide className="home-page__main slide-in">
			<div className="heroImg"></div>
			<img className="bikeImg" src={bike} />


			<div
				className="wrapper main-wrap"
				style={{
					justifyContent: statements.length > 0 ? "start" : "center",
				}}
			>

				{!loading ? (
					statements.map((statement) => (
						<MainCard key={statement.statementId} statement={statement} />
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
