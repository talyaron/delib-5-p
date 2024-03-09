// Third party imports
import { createBrowserRouter } from "react-router-dom";

// Custom components
import ErrorPage from "./view/pages/error/ErrorPage";
import App from "./App";
import Start from "./view/pages/start/Start";
import Home from "./view/pages/home/Home";
import Main from "./view/pages/main/Main";
import AddStatement from "./view/pages/main/addStatement";
import Statement from "./view/pages/statement/StatementMain";
import Page404 from "./view/pages/page404/Page404";
import PricingPlan from "./view/pages/pricing/PricingPlan";
import SignInToContinue from "./view/pages/pricing/SignInToContinue";

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
                        element: <Main />,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "addStatment",
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
                path: "login-first",
                element: <SignInToContinue />,
                errorElement: <ErrorPage />,
            },
            {
                path: "statement/:statementId/:page",
                element: <Statement />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: ":sort",
                        element: <Statement />,
                        errorElement: <ErrorPage />,
                    },
                ],
            },
            {
                path: "statement-an/:anonymous/:statementId/:page",
                element: <Statement />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: ":sort",
                        element: <Statement />,
                        errorElement: <ErrorPage />,
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <Page404 />,
        errorElement: <ErrorPage />,
    },
]);
