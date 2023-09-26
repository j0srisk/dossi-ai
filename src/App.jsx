import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Error from './pages/Error';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import CollectionContainer from './pages/CollectionContainer';
import DocumentContainer from './pages/DocumentContainer';
import Main from './layouts/Main';
import TestLayout from './layouts/TestLayout';

import { AuthProvider } from './contexts/auth';
import { supabase } from './services/supabase';

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
				/*
				{
					path: ':id',
					element: <Account />,
					loader: async ({ params }) => {
						return supabase.from('profiles').select('*').eq('id', params.id).single();
					},
				},*/
				{
					path: 'c',
					element: <TestLayout />,
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
