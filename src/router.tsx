import { lazy, Suspense } from "react";

// Third party imports
import { createBrowserRouter } from "react-router-dom";

// Custom components
import ErrorPage from "./view/pages/error/ErrorPage";
import Loader from "./view/components/loaders/Loader";
import App from "./App";

// Lazy loading
const Page404 = lazy(() => import("./view/pages/page404/Page404"));
const Home = lazy(() => import("./view/pages/home/Home"));
const Start = lazy(() => import("./view/pages/start/Start"));
const Main = lazy(() => import("./view/pages/main/Main"));
const Statement = lazy(() => import("./view/pages/statement/Statement"));
const AddStatement = lazy(() => import("./view/pages/main/addStatement"));

export const SuspenseFallback = () => {
    return (
        <div
            style={{
                width: "100svw",
                height: "100svh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Loader />
        </div>
    );
};

export const SuspenseComp = ({ chlildren }: any) => {
    return <Suspense fallback={<SuspenseFallback />}>{chlildren}</Suspense>;
};

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
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <Home />
                    </Suspense>
                ),
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <Main />
                            </Suspense>
                        ),
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "addStatment",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <AddStatement />
                            </Suspense>
                        ),
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "updateStatement/:statementId",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <AddStatement />
                            </Suspense>
                        ),
                        errorElement: <ErrorPage />,
                    },
                ],
            },
            {
                path: "statement/:statementId/:page",
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <Statement />
                    </Suspense>
                ),
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: ":sort",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <Statement />
                            </Suspense>
                        ),
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
