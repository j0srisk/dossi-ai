import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Error from './pages/Error';
import Dashboard from './pages/Dashboard';
import Main from './layouts/Main';

import { AuthProvider } from './contexts/auth';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Main />,
			children: [
				{
					index: true,
					element: <LandingPage />,
				},
				{
					path: 'login',
					element: <Login />,
				},
				{
					path: 'dashboard',
					element: <Dashboard />,
				},
				{
					path: '*',
					element: <Error />,
				},
			],
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
