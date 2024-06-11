import { useEffect, useState } from "react";

// Third party imports
import { Outlet, useLocation, useParams } from "react-router-dom";

// Redux Store
import {
	useAppDispatch,
	useAppSelector,
} from "../../../controllers/hooks/reduxHooks";
import { userSelector } from "../../../model/users/userSlice";

// Helpers
import { listenToStatementSubscriptions } from "../../../controllers/db/subscriptions/getSubscriptions";

// Custom Components
import HomeHeader from "./HomeHeader";
import ScreenSlide from "../../components/animation/ScreenSlide";

interface ListenedStatements{
	unsubFunction:()=>void;
	statementId:string;
}

export let listenedStatements:Array<ListenedStatements> = [];

export default function Home() {
	// Hooks
	const { statementId } = useParams();
	const location = useLocation();

	// Redux Store
	const user = useAppSelector(userSelector);

	// Use States
	const [displayHeader, setDisplayHeader] = useState(true);

	useEffect(() => {
		if (location.pathname.includes("addStatement") || statementId) {
			setDisplayHeader(false);
		} else {
			setDisplayHeader(true);
		}
	}, [location]);

	useEffect(() => {
		let unsubscribe: () => void = () => {};
		try {
			if (user) {
				unsubscribe = listenToStatementSubscriptions(30);
			}
		} catch (error) {}

		return () => {
			if (unsubscribe) {
				unsubscribe();
				listenedStatements.forEach((ls)=>{
					ls.unsubFunction();
				});
			}
		};
	}, [user]);

	return (
		<ScreenSlide className="page slide-in">
			{displayHeader && <HomeHeader />}
			<Outlet />
		</ScreenSlide>
	);
}
