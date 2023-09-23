import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from './useAuth';

const useRequireUnauth = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate('/dashboard');
		}
	}, [user, navigate]);
};

export default useRequireUnauth;
