// Third party imports
import { createBrowserRouter } from "react-router-dom";

// Custom components
import ErrorPage from "./view/pages/error/ErrorPage";
import App from "./App";
import Start from "./view/pages/start/Start";
import Home from "./view/pages/home/Home";
import HomeMain from "./view/pages/home/main/HomeMain";
import AddStatement from "./view/pages/home/main/addStatement/AddStatement";
import StatementMain from "./view/pages/statement/StatementMain";
import Page404 from "./view/pages/page404/Page404";
import PricingPlan from "./view/pages/pricing/PricingPlan";
import LoginPage from "./view/pages/login/LoginFirst";
import MemberRejection from "./view/pages/memberRejection/MemberRejection";
import Page401 from "./view/pages/page401/Page401";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "",
				element: <Start />,
				errorElement: <ErrorPage />,
			},
			{
				path: "home",
				element: <Home />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: "",
						element: <HomeMain />,
						errorElement: <ErrorPage />,
					},
					{
						path: "addStatement",
						element: <AddStatement />,
						errorElement: <ErrorPage />,
					},
					{
						path: "updateStatement/:statementId",
						element: <AddStatement />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: "pricing-plan",
				element: <PricingPlan />,
				errorElement: <ErrorPage />,
			},
			{
				path: "member-rejection",
				element: <MemberRejection />,
				errorElement: <ErrorPage />,
			},
			{
				path: "login-first",
				element: <LoginPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: "statement/:statementId/:page",
				element: <StatementMain />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: ":sort",
						element: <StatementMain />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: "statement-an/:anonymous/:statementId/:page",
				element: <StatementMain />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: ":sort",
						element: <StatementMain />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: "401",
				element: <Page401 />,
			},
		],
	},
	{
		path: "404",
		element: <Page404 />,
	},
	{
		path: "*",
		element: <Page404 />,
		errorElement: <ErrorPage />,
	},
]);
