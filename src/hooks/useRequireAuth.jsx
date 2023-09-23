import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const useRequireAuth = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/');
		}
	}, [user, navigate]);

	return user;
};

export default useRequireAuth;
