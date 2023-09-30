import { AuthContext } from '../contexts/auth';
import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAuth = ({ redirectTo = null } = {}) => {
	const navigate = useNavigate();
	const auth = useContext(AuthContext);
	const location = useLocation();

	useEffect(() => {
		//signed in user shouldn't be able to access auth pages
		if (auth.user && location.pathname.startsWith('/auth')) {
			navigate('/');
		}
		//signed out user should be redirected to auth pages
		if (!auth.user) {
			navigate(redirectTo);
		}
	}, [auth.user, navigate, redirectTo, location.pathname]);

	return auth;
};

export default useAuth;
