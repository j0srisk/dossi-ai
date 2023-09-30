import { Outlet } from 'react-router-dom';

const Auth = () => {
	return (
		<div>
			<div className="flex h-screen items-center justify-center bg-zinc-900">
				<Outlet />
			</div>
		</div>
	);
};

export default Auth;
