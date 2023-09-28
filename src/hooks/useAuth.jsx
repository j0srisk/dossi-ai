import { AuthContext } from '../contexts/auth';
import { useContext } from 'react';

const useAuth = () => {
	return useContext(AuthContext);
};

export default useAuth;
