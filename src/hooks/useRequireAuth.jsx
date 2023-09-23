import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';

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
