import useUser from '../../hooks/useUser';
import { supabase } from '../../services/supabase';
import { useState, useEffect, useCallback } from 'react';

const AccountInfo = () => {
	const [userProfile, setUserProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const { user } = useUser();

	const fetchUserProfileData = useCallback(async () => {
		const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
		if (error) {
			console.log('error fetching user profile data');
			alert(error.message);
		} else {
			setUserProfile(data);
			setLoading(false);
		}
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
