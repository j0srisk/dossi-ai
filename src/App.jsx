import Content from './components/Content';
import DocumentContainer from './components/DocumentContainer';
import { AuthProvider } from './contexts/auth';
import Auth from './layouts/Auth';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import { supabase } from './services/supabase';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Dashboard />,
			children: [
				{
					path: 'c/:collectionId',
					element: <Content />,
					loader: async ({ params }) => {
						return await supabase
							.from('collections')
							.select('*')
							.eq('id', params.collectionId)
							.single();
					},
					children: [
						{
							path: ':documentId',
							element: <DocumentContainer />,
							loader: async ({ params }) => {
								return await supabase
									.from('documents')
									.select('*')
									.eq('id', params.documentId)
									.single();
							},
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
			],
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
