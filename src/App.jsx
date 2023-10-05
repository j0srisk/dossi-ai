import { AuthProvider } from './contexts/auth';
import Auth from './layouts/Auth';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Dashboard />,
			children: [
				{
					path: 'c/:collectionId',
					element: null,
					children: [
						{
							path: ':documentId',
							element: null,
						},
					],
				},
			],
		},
		{
			path: 'auth',
			element: <Auth />,
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
			path: '/account/:userId',
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
