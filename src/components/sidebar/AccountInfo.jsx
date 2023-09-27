import useRequireAuth from '../../hooks/useRequireAuth';
import { supabase } from '../../services/supabase';
import { useState, useEffect, useCallback } from 'react';

const AccountInfo = () => {
	const [userProfile, setUserProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const user = useRequireAuth();

	const fetchUserProfileData = useCallback(async () => {
		const res = await supabase.from('profiles').select('*').eq('id', user.id).single();
		setUserProfile(res.data);
		setLoading(false);
	}, [user]);

	useEffect(() => {
		if (user && user.id) {
			fetchUserProfileData();
		}
	}, [user, fetchUserProfileData]);

	return (
		<button className="border-t border-neutral-500 p-5">
			{!loading ? (
				<p className="text-center text-base font-bold text-white">
					{userProfile.first_name} {userProfile.last_name}
				</p>
			) : (
				<p className="text-center text-base font-bold text-white">Loading...</p>
			)}
		</button>
	);
};

export default AccountInfo;
