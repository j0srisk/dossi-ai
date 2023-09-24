import { useState } from 'react';
import useRequireAuth from '../hooks/useRequireAuth';
import useAuth from '../hooks/useAuth';

import Collection from '../components/Collection';

const Dashboard = () => {
	const [activeCollection, setActiveCollection] = useState(null);
	const user = useRequireAuth();
	const { signOut } = useAuth();

	if (!user) {
		return null;
	}

	async function handleSignOut() {
		const { error } = await signOut();
		if (error) {
			alert(error.message);
		} else {
			console.log('success');
		}
	}

	return (
		<div className="flex h-screen w-screen bg-white">
			<div className="w-64 bg-neutral-800 p-2">
				<div className="flex h-full flex-col">
					<button className="mb-2  rounded-md border border-neutral-500 p-3">
						<p className="text-center text-base font-bold text-white">New Collection</p>
					</button>
					<div className="flex flex-1 flex-col gap-2 overflow-scroll">
						<Collection
							id="1"
							activeCollection={activeCollection}
							setActiveCollection={setActiveCollection}
						/>
						<Collection
							id="2"
							activeCollection={activeCollection}
							setActiveCollection={setActiveCollection}
						/>
					</div>
					<button className="border-t border-neutral-500 p-5">
						<p className=" text-center text-base font-bold text-white">{user.email}</p>
					</button>
					<button className="rounded-md  bg-rose-600 p-3 hover:bg-rose-700" onClick={handleSignOut}>
						<p className="text-center text-base font-bold text-white">Sign Out</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
