import Login from './Login';

const AuthWrapper = ({ session, children }) => {
	return <>{!session ? <Login /> : children}</>;
};

export default AuthWrapper;
