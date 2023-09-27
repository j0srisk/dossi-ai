import Sidebar from '../components/Sidebar';
import { CollectionsProvider } from '../contexts/collections';
import useRequireAuth from '../hooks/useRequireAuth';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
	useRequireAuth();
	return (
		<CollectionsProvider>
			<div className="flex h-screen w-screen">
				<div className="bg-neutral-800 p-2 w-80">
					<Sidebar />
				</div>
				<div className="flex flex-1 flex-col bg-zinc-900">
					<Outlet />
				</div>
			</div>
		</CollectionsProvider>
	);
};

export default Dashboard;
