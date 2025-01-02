// Third party imports
import { createBrowserRouter } from 'react-router-dom';

// Custom components
import App from './App';
import ErrorPage from './view/pages/error/ErrorPage';
import Home from './view/pages/home/Home';
import AddStatement from './view/pages/home/main/addStatement/AddStatement';
import HomeMain from './view/pages/home/main/HomeMain';
import LoginPage from './view/pages/login/LoginFirst';
import MemberRejection from './view/pages/memberRejection/MemberRejection';
import Page401 from './view/pages/page401/Page401';
import Page404 from './view/pages/page404/Page404';
import Start from './view/pages/start/Start';
import StatementMain from './view/pages/statement/StatementMain';

const routes = [
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '',
				element: <Start />,
				errorElement: <ErrorPage />,
			},
			{
				path: 'home',
				element: <Home />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: '',
						element: <HomeMain />,
						errorElement: <ErrorPage />,
					},
					{
						path: 'addStatement',
						element: <AddStatement />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: 'member-rejection',
				element: <MemberRejection />,
				errorElement: <ErrorPage />,
			},
			{
				path: 'login-first',
				element: <LoginPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: 'statement/:statementId',
				element: <StatementMain />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: ':screen',
						element: <StatementMain />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: 'statement/:statementId/:page',
				element: <StatementMain />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: ':sort',
						element: <StatementMain />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: 'statement-an/:anonymous/:statementId/:page',
				element: <StatementMain />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: ':sort',
						element: <StatementMain />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: '401',
				element: <Page401 />,
			},
		],
	},
	{
		path: '404',
		element: <Page404 />,
	},
	{
		path: '*',
		element: <Page404 />,
		errorElement: <ErrorPage />,
	},
];

export const router = createBrowserRouter(routes, {
	future: {
		v7_partialHydration: true,
		v7_normalizeFormMethod: true,
		v7_fetcherPersist: true,
		v7_skipActionErrorRevalidation: true,
		v7_relativeSplatPath: true,
	},
});
