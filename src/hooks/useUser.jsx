import { AuthContext } from '../contexts/auth';
import { useContext } from 'react';

const useUser = () => {
	const auth = useContext(AuthContext);

	return auth;
};

export default useUser;
