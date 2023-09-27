import { AuthProvider } from './contexts/auth';
import Dashboard from './layouts/Dashboard';
import Main from './layouts/Main';
import CollectionContainer from './pages/CollectionContainer';
import DocumentContainer from './pages/DocumentContainer';
import Error from './pages/Error';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import { supabase } from './services/supabase';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
					path: '*',
					element: <Error />,
				},
				{
					path: 'c',
					element: <Dashboard />,
					children: [
						{
							path: ':collectionId',
							element: <CollectionContainer />,
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
