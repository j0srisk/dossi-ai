import { useState, useEffect } from 'react';
import useRequireAuth from '../hooks/useRequireAuth';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import Collections from '../components/Collections';
import { supabase } from '../services/supabase';

const Dashboard = () => {
	const [userProfile, setUserProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const user = useRequireAuth();
	const { signOut } = useAuth();
	const navigate = useNavigate();

	async function fetchUserProfileData() {
		const res = await supabase.from('profiles').select('*').single();
		setUserProfile(res.data);
		setLoading(false);
	}

	useEffect(() => {
		fetchUserProfileData();
	}, []);

	async function handleSignOut() {
		const { error } = await signOut();
		if (error) {
			alert(error.message);
		} else {
			console.log('success');
		}
	}

	if (!user) {
		return null;
	}

	return (
		<div className="flex h-screen w-screen bg-white">
			<div className="w-64 bg-neutral-800 p-2">
				<div className="flex h-full flex-col">
					<Collections />
					<button
						className="border-t border-neutral-500 p-5"
						onClick={() => navigate(`/${user.id}`)}
					>
						{!loading ? (
							<p className="text-center text-base font-bold text-white">
								{userProfile.first_name} {userProfile.last_name}
							</p>
						) : (
							<p className="text-center text-base font-bold text-white">Loading...</p>
						)}
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
