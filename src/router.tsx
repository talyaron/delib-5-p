import { lazy, Suspense } from "react"

// Third party imports
import { createBrowserRouter } from "react-router-dom"

// Custom components
import Start from "./view/pages/start/Start"
import App from "./view/pages/home/App"
import All from "./view/pages/all/All"
import ErrorPage from "./view/pages/error/ErrorPage"
import Loader from "./view/components/loaders/Loader"

// Lazy loading
const Main = lazy(() => import("./view/pages/main/Main"))
const Statement = lazy(() => import("./view/pages/statement/Statement"))
const SetStatement = lazy(
    () => import("./view/pages/statement/components/set/SetStatement")
)

const SuspenseFallback = () => {
    return (
        <div
            style={{
                width: "100svw",
                height: "100svh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Loader />
        </div>
    )
}

export const SuspenseComp = ({ chlildren }: any) => {
    return <Suspense fallback={<SuspenseFallback />}>{chlildren}</Suspense>
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <All />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Start />,
                errorElement: <ErrorPage />,
            },
            {
                path: "home",
                element: <App />,
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
                                <SetStatement />
                            </Suspense>
                        ),
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "updateStatement/:statementId",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <SetStatement />
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
            },
        ],
    },
])
