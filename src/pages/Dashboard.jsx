import Main from '../components/Main';
import Sidebar from '../components/Sidebar';
import { CollectionsProvider } from '../contexts/collections';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';

const Dashboard = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const { user } = useAuth({ redirectTo: '/auth' });

	if (!user) {
		return null;
	}

	const toggleSidebar = () => {
		console.log('toggling sidebar');
		setSidebarOpen((prev) => !prev);
	};

	return (
		<CollectionsProvider>
			<div className="flex h-screen w-screen relative">
				<div className={`w-80 ${sidebarOpen ? 'block' : 'hidden'}`}>
					<Sidebar toggleSidebar={toggleSidebar} />
				</div>
				<div className="flex-1 bg-zinc-900">
					<Main />
				</div>
			</div>
			{!sidebarOpen && (
				<div className="absolute top-6 left-6 z-20 rounded-md bg-white">
					<button
						className="rounded-md flex items-center h-full aspect-square text-neutral-300 gap-2 justify-center p-1 border-neutral-300 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:text-neutral-700 hover:bg-opacity-10 transition-all"
						onClick={toggleSidebar}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							role="img"
							stroke="currentColor"
							className="w-6 h-6"
							width="100%"
							height="100%"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 256 256"
						>
							<path
								fill="currentColor"
								d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM40 56h40v144H40Zm176 144H96V56h120v144Z"
							/>
						</svg>
					</button>
				</div>
			)}
		</CollectionsProvider>
	);
};

export default Dashboard;
