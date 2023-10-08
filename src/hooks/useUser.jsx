import { AuthContext } from '../contexts/auth';
import { supabase } from '../services/supabase';
import { useContext, useState, useEffect, useCallback } from 'react';

const useUser = () => {
	const [profile, setProfile] = useState(null);
	const auth = useContext(AuthContext);

	const fetchUserProfile = useCallback(async () => {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', auth.user.id)
			.single();
		if (error) {
			console.log('error fetching user profile data');
			alert(error.message);
		} else {
			setProfile(data);
		}
	}, [auth.user]);

	useEffect(() => {
		if (auth.user && auth.user.id) {
			fetchUserProfile();
		}
	}, [auth.user, fetchUserProfile]);

	return { ...auth, profile };
};

export default useUser;
