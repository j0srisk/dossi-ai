import Content from '../components/Content';
import AccountInfo from '../components/sidebar/AccountInfo';
import CollectionManager from '../components/sidebar/CollectionManager';
import useAuth from '../hooks/useAuth';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
	const { signOut } = useAuth();

	async function handleSignOut() {
		const { error } = await signOut();
		if (error) {
			alert(error.message);
		} else {
			console.log('success');
		}
	}

	return (
		<div className="flex h-screen w-screen">
			<div className="bg-neutral-800 p-2 w-80">
				<div className="flex h-full flex-col">
					<CollectionManager />
					<AccountInfo />
					<button className="rounded-md  bg-rose-600 p-3 hover:bg-rose-700" onClick={handleSignOut}>
						<p className="text-center text-base font-bold text-white">Sign Out</p>
					</button>
				</div>
			</div>
			<div className="flex flex-1 flex-col">
				<Outlet />
			</div>
		</div>
	);
};

export default Dashboard;
