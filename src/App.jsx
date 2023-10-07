import { AuthProvider } from './contexts/auth';
import { CollectionsProvider } from './contexts/collections';
import Centered from './layouts/Centered';
import Account from './pages/Account';
import Collections from './pages/Collections';
import Error from './pages/Error';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Main from './pages/Main';
import SignUp from './pages/SignUp';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: (
				<CollectionsProvider>
					<Collections />
				</CollectionsProvider>
			),
		},
		{
			path: 'c/:collectionId',
			element: (
				<CollectionsProvider>
					<Main />
				</CollectionsProvider>
			),
			children: [
				{
					path: 'd/:documentId',
					element: null,
				},
			],
		},
		{
			path: 'auth',
			element: <Centered />,
			children: [
				{
					path: '',
					element: <LandingPage />,
				},
				{
					path: 'login',
					element: <Login />,
				},
				{
					path: 'signup',
					element: <SignUp />,
				},
			],
		},
		{
			path: '/account',
			element: <Account />,
		},
		{
			path: '*',
			element: <Error />,
		},
	]);

	return (
		<div>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</div>
	);
}

export default App;
