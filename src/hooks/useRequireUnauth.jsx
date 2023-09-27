import useAuth from './useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useRequireUnauth = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate('');
		}
	}, [user, navigate]);
};

export default useRequireUnauth;
