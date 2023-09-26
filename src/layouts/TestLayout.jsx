import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRequireAuth from '../hooks/useRequireAuth';
import { supabase } from '../services/supabase';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Collections from '../components/Collections';

const TestLayout = () => {
	const [userProfile, setUserProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const user = useRequireAuth();

	const { signOut } = useAuth();

	const navigate = useNavigate();

	async function fetchUserProfileData() {
		const res = await supabase.from('profiles').select('*').eq('id', user.id).single();
		setUserProfile(res.data);
		setLoading(false);
	}

	useEffect(() => {
		if (user && user.id) {
			fetchUserProfileData();
		}
	}, [user]);

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
					<div className="flex flex-1 flex-col">
						<Collections />
					</div>
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
			<div className="flex flex-1 flex-col">
				<Outlet />
			</div>
		</div>
	);
};

export default TestLayout;
