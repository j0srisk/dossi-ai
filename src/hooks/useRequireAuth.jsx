import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useRequireAuth = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/auth');
		}
	}, [user, navigate]);

	return user;
};

export default useRequireAuth;
