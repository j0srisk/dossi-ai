import { AuthContext } from '../contexts/auth';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = ({ redirectTo = null } = {}) => {
	const navigate = useNavigate();
	const auth = useContext(AuthContext);

	useEffect(() => {
		if (redirectTo && !auth.user) {
			navigate('/auth');
		}
		if (redirectTo && auth.user) {
			console.log('redirecting to /');
			navigate('/');
		}
	}, [auth.user, navigate, redirectTo]);

	return auth;
};

export default useAuth;
